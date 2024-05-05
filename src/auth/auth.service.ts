import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(signInDto: SignInDto, res: Response){
        try {
            const searchUser = await this.usersService.findOneByEmail(signInDto.email);
            if (searchUser.status === "error") {
                throw new HttpException(searchUser.message, HttpStatus.NOT_FOUND);
            }
            const user = searchUser.data;
            console.log("user : ", user);
            const isPasswordMatch = await bcrypt.compare(signInDto.password, user.password);
            if (!isPasswordMatch) {
                throw new UnauthorizedException({ message: 'Incorrect username or password'})
            }
      
            const payload = { email: user.email, sub: user.id, role: user.role};
    
            const accessToken = await this.jwtService.signAsync(payload);
            const refreshToken = await this.jwtService.signAsync(
                payload,
                { secret: process.env.REFRESH_TOKEN_SECRET,
                  expiresIn: '7d'  
                });
    
            const updateUser = {
                id: user.id,
                email: user.email,
                password: user.password,
                refreshToken: refreshToken
            }
            await this.updateRefreshToken(updateUser , res);
            
            return { accessToken, user };
        } catch(error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateRefreshToken(updateUserDto: UpdateUserDto , res: Response) {
        try {
            const searchUser = await this.usersService.findOneByEmail(updateUserDto.email);
            const user = searchUser.data;
            const userId = user.id;
    
            console.log("userId : ", userId);
            const updateResult = await this.usersService.updateRefreshToken(updateUserDto);
            res.cookie('refresh_token', updateUserDto.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7});
            return { status: "success", data: updateResult};
        } catch(error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async signUp(createUserDto: CreateUserDto, res: Response) {
        try {
            const creatingUser = await this.usersService.create(createUserDto);
            if (creatingUser.status === "error") {
                throw new HttpException(creatingUser.message, HttpStatus.CONFLICT);
            }
            const user = creatingUser.data;
            const payload = { email: user.email, sub: user.id, role: user.role};
            const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET });
            const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET });
            const userDto = {email: user.email, password: createUserDto.password, refreshToken }
            await this.updateRefreshToken(userDto, res);
            const data = {...user, refreshToken};
            return { status: "success", data , accessToken };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async signOut(req: Request, res: Response) {

        try {
            const refreshToken = req.headers.authorization?.split(' ')[1];
            const searchUser = await this.jwtService.decode(refreshToken);
            await this.usersService.deleteRefreshToken(searchUser.username);
            res.clearCookie('refresh_token');
            return { status: "success", message: "User signed out successfully" };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async handleRefreshToken(req: Request) {
        try {
            const cookies = req.cookies;
            if(!cookies?.refresh_token) {
                throw new UnauthorizedException({ message: 'Unauthorized'});
            }
            const refreshToken = cookies.refresh_token;
            const searchUser = await this.jwtService.decode(refreshToken);
            const user = await this.usersService.findOneByEmail(searchUser.email);
            if (user.status === "error") {
                throw new UnauthorizedException({ message: 'Unauthorized'});
            }
            const decodedUser = await this.jwtService.verifyAsync(
                refreshToken,
                { secret: process.env.REFRESH_TOKEN_SECRET}
            );

            const payload = { email: decodedUser.email, sub: decodedUser.sub, role: decodedUser.role};
            const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET });
            return { accessToken };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}

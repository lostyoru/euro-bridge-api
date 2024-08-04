import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CompanyService } from 'src/company/company.service';
import { User } from 'src/users/entities/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private companyService: CompanyService,
        private jwtService: JwtService,
    ) {}

    async signIn(signInDto: SignInDto, res: Response){
        try {
            console.log("signInDto : ", signInDto);
            const searchUser = await this.usersService.findOneByEmail(signInDto.email);
            if (searchUser.status === "error") {
                throw new HttpException(searchUser.message, HttpStatus.NOT_FOUND);
            }
            const user = searchUser.data;
            const isPasswordMatch = await bcrypt.compare(signInDto.password, user.password);
            if (!isPasswordMatch) {
                console.log("Incorrect username or password");
                throw new UnauthorizedException({ message: 'Incorrect username or password'})
            }
            const userDto = instanceToPlain(user) as User;
            console.log("userDto : ", userDto);
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
            
            return { accessToken, user: userDto };
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

    async signUp(createUserDto: CreateUserDto) {
        console.log("createUserDto : ", createUserDto);
        try {
            console.log("ssss");
            const creatingUser = await this.usersService.create(createUserDto);
 
            if (creatingUser.status === "error") {

                throw new HttpException(creatingUser.message, HttpStatus.CONFLICT);
            }
            const user = creatingUser.data;
            console.log("user for company : ", user);
            if(user?.role === "COMPANY") {
                console.log("inside company");
                await this.companyService.createCompany(creatingUser.data);
            }
            // const payload = { email: user.email, sub: user.id, role: user.role};
            // const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET });
            // const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET });
            // const userDto = {email: user.email, password: createUserDto.password, refreshToken }
            // await this.updateRefreshToken(userDto, res);
            // const data = {...user, refreshToken};
            return { status: "success" };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async signOut(req: Request, res: Response) {

        try {
            console.log("inside signout started");
            const refreshToken = req.headers.authorization?.split(' ')[1] || req.cookies.refresh_token;
            const searchUser = await this.jwtService.decode(refreshToken);
            await this.usersService.deleteRefreshToken(searchUser.username);
            console.log("inside signout ended");
            res.clearCookie('refresh_token');
            console.log("clear cookie");
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
            const user = await (await this.usersService.findOneByEmail(searchUser.email))

            if (user.status === "error") {
                throw new UnauthorizedException({ message: 'Unauthorized'});
            }
            const userDto = instanceToPlain(user.data) as User;
            const decodedUser = await this.jwtService.verifyAsync(
                refreshToken,
                { secret: process.env.REFRESH_TOKEN_SECRET}
            );

            const payload = { email: decodedUser.email, sub: decodedUser.sub, role: decodedUser.role};
            const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET });
            return { user: userDto, accessToken };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}

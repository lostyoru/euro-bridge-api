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
        const searchUser = await this.usersService.findOneByUsername(signInDto.username);
        if (searchUser.status === "error") {
            throw new HttpException(searchUser.message, HttpStatus.NOT_FOUND);
        }
        const user = searchUser.data;
        const isPasswordMatch = await bcrypt.compare(signInDto.password, user.password);
        if (!isPasswordMatch) {
            throw new UnauthorizedException({ message: 'Incorrect username or password'})
        }
  
        const payload = { username: user.username, sub: user.id };

        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = await this.jwtService.signAsync(
            payload,
            { secret: process.env.REFRESH_TOKEN_SECRET,
              expiresIn: '7d'  
            });

        const updateUser = {
            id: user.id,
            username: user.username,
            password: user.password,
            refreshToken: refreshToken
        }
        await this.updateRefreshToken(updateUser , res);
        
        return { accessToken };
    }

    async updateRefreshToken(updateUserDto: UpdateUserDto , res: Response) {
        const searchUser = await this.usersService.findOneByUsername(updateUserDto.username);
        const user = searchUser.data;
        const userId = user.id;

        console.log("userId : ", userId);
        const updateResult = await this.usersService.updateRefreshToken(updateUserDto, res);
        res.cookie('refresh_token', updateUserDto.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7});
        return { status: "success", data: updateResult}
    }

    async signUp(createUserDto: CreateUserDto, res: Response) {
        const creatingUser = await this.usersService.create(createUserDto);
        if (creatingUser.status === "error") {
            throw new HttpException(creatingUser.message, HttpStatus.CONFLICT);
        }
        const user = creatingUser.data;
        const payload = { username: user.username, sub: user.id };
        const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET });
        const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET });
        const userDto = {username: user.username, password: createUserDto.password, refreshToken }
        await this.updateRefreshToken(userDto, res);
        const data = {...user, refreshToken};
        return { status: "success", data , accessToken };
    }

    async signOut(req: Request, res: Response) {

        const refreshToken = req.headers.authorization?.split(' ')[1];
        const searchUser = await this.jwtService.decode(refreshToken);
        await this.usersService.deleteRefreshToken(searchUser.username);
        res.clearCookie('refresh_token');
        return { status: "success", message: "User signed out successfully" };

    }


}

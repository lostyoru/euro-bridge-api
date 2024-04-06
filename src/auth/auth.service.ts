import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants , access_token } from './constants';
import exp from 'constants';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(@Body() signInDto: SignInDto){
        console.log("start signin");
        // console.log("secret access_token", access_token);
        const searchUser = await this.usersService.findOneByUsername(signInDto.username);
        if (searchUser.status === "error") {
            // console.log("User not found");
            return { message: "User not found" };
        }
        const user = searchUser.data;
        const isPasswordMatch = await bcrypt.compare(signInDto.password, user.password);
        if (!isPasswordMatch) {
            // console.log("Password not match");
            throw new UnauthorizedException({ message: 'Incorrect username or password'})
        }
  
        const payload = { username: user.username, sub: user.id };
        // console.log("loged in");   
        // console.log("jwt : ", this.jwtService);
        console.log("this is from the constants : ", jwtConstants.accessTokenSecret)
        const accessToken = await this.jwtService.signAsync(payload);
        console.log("accessToken : ", accessToken);
        const refreshToken = await this.jwtService.signAsync(
            payload,
            { secret: process.env.REFRESH_TOKEN_SECRET,
              expiresIn: '7d'  
            });
        console.log("refreshToken : ", refreshToken);
        // await this.aService.updateRefreshToken(user.id, refreshToken);
        const updateUser = {
            id: user.id,
            username: user.username,
            password: user.password,
            refreshToken: refreshToken
        }
        await this.updateRefreshToken(updateUser);
        return { access_token: accessToken };
    }

    async updateRefreshToken(updateUserDto: UpdateUserDto) {
        const searchUser = await this.usersService.findOneByUsername(updateUserDto.username);
        const user = searchUser.data;
        const userId = user.id;
        console.log("userId : ", userId);
        return this.usersService.updateRefreshToken(updateUserDto);
    }
}

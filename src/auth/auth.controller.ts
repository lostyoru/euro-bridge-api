import { Body, Controller, Get, Post, UseGuards, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './guards/auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signin')
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.signIn(signInDto, res);
    }

    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto){
        return this.authService.signUp(createUserDto);
    }

    @Get('signout')
    async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        console.log("inside signout");
        return this.authService.signOut(req, res);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @Get('refresh')
    async handleRefreshToken(@Req() req: Request) {
        return this.authService.handleRefreshToken(req);
    }
}

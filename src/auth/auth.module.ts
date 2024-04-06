import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
    global: true,
    secret: process.env.ACCESS_TOKEN_SECRET,
    signOptions: { expiresIn: '30m' },
  }),],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

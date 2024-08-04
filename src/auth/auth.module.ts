import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from 'src/company/company.module';


@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
    global: true,
    secret: process.env.ACCESS_TOKEN_SECRET,
    signOptions: { expiresIn: '30m' },
  }), CompanyModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

import { IsEmail, IsIn, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { Role } from "./role";

export class CreateUserDto {
    @IsString()
    name: string;
  
    @IsNumber()
    @IsOptional()
    age?: number; 
  
    @IsString()
    @Matches(
      /^(?=.{8,}$)[a-zA-Z_][a-zA-Z0-9_.-]{7,}$/,
      {
        message: "Username must be at least 8 characters long and can only contain letters, numbers, underscores, dots, and hyphens",
      }
    )
    username: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @Matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+-=|\[\]{};':",<.>/?\\])[0-9a-zA-Z!@#$%^&*()_+-=|\[\]{};':",<.>/?]{8,}$/,
      {
        message: "Password must have 8 characters, at least one uppercase letter, one lowercase letter and one number",
      }
    )
    password: string;
  
    @IsString()
    @IsIn([Role.USER, Role.ADMIN], {
      message: "Role must be either 'user' or 'admin'",
    })
    role: Role;
  
    isVerified: boolean = false; 

    @IsOptional()
    refreshToken: string;
  
  }
import { IsEmail, IsIn, IsOptional, IsString, Matches } from "class-validator";
import { Role } from "./role";
// import { Message } from "src/chat/entities/message.entity";
// import { UserContact } from "../entities/usercontact.entity";
export class CreateUserDto {
    @IsString()
    name: string;
  
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
    @IsIn([Role.INTERSHIP_SEEKER, Role.COMPANY], {
      message: "Role must be either 'intership seeker' or 'company'",
    })
    role: Role;

    @IsOptional()
    image: string;

    @IsOptional()
    coverImage: string;

    @IsOptional()
    refreshToken: string;

  }
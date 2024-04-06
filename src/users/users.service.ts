import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
    ) {}
  
  async create(createUserDto: CreateUserDto) {

    const existingEmail = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existingEmail) {
      return { message: "Email already exists" };
    }

    const existingUsername = await this.usersRepository.findOne({ where: { username: createUserDto.username } });
    if (existingUsername) {
      return { message: "Username already exists" };
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    return user;
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {

    const existingUser = await this.usersRepository.findOne({ where: { id } });

    if (!existingUser) {
      return { message: "User not found" };
    }

    return existingUser;
  }

  async findOneByUsername(username: string) {
      console.log("start searching")
      const existingUser = await this.usersRepository.findOne({ where: { username } });
      console.log("existingUser", existingUser);
      if (!existingUser) {
        return { status: "error", message: "User not found"};
      }
    
      return { status: "success", data: existingUser };
    }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log("start update");
    console.log("updateUserDto", updateUserDto);
    const user = await this.usersRepository.findOne({ where: { id } });
    const password = await bcrypt.hash(updateUserDto.password, 10);
    console.log("mid update");
    console.log("user", user);
    if(!user) {
      return { message: "User not found" };
    }

    const matchedPassword = await bcrypt.compare(updateUserDto.password, user.password);
    if(!matchedPassword){      
      return { message: "Password does not match" };
    }
    
    await this.usersRepository.update(id, {...updateUserDto, password});

    return { message: "User updated successfully" };
  }

  async updateRefreshToken(updateUserDto: UpdateUserDto) {
    const searchUser = await this.usersRepository.findOne({ where: { username: updateUserDto.username } });
    const user = searchUser;
    const userId = user.id;
    console.log("userId : ", userId);
    return this.usersRepository.update(userId, updateUserDto);
  }

  async remove(id: number) {

    const deleteResponse = await this.usersRepository.delete(id);
    if(deleteResponse.affected === 0) {
      return { message: "User not found" };
    }

    return { message: "User deleted successfully" };
  }
  
}

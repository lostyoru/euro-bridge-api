import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserContact } from './entities/usercontact.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserContact)
    private userContactRepository: Repository<UserContact>,
    ) {}
  
  async create(createUserDto: CreateUserDto) {

    const existingEmail = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existingEmail) {
      HttpStatus.CONFLICT;
      return { status: "error", message: "Email already exists"};
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    return { status: "success", data: user };
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

  async findOneByEmail(email: string) {
    
      const existingUser = await this.usersRepository.findOne({ where: { email } });
      if (!existingUser) {
        return { status: "error", message: "User not found"};
      }
    
      return { status: "success", data: existingUser };
    }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    const password = await bcrypt.hash(updateUserDto.password, 10);
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

    const searchUser = await this.usersRepository.findOne({ where: { email: updateUserDto.email } });
    const user = searchUser;
    const userId = user.id;
    return this.usersRepository.update(userId, updateUserDto);

  }

  async deleteRefreshToken(email: string) {
    const searchUser = await this.usersRepository.findOne({ where: { email } });
    const user = searchUser;
    const userId = user.id;
    return this.usersRepository.update(userId, { refreshToken: "" });
  }

  async remove(id: number) {
    const deleteResponse = await this.usersRepository.delete(id);
    if(deleteResponse.affected === 0) {
      return { message: "User not found" };
    }

    return { message: "User deleted successfully" };
  }



  async addContact(userId: number, contactId: number): Promise<{ firstUser: User; secondUser: User; userContact: UserContact } | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['contacts'] });
      const contact = await this.usersRepository.findOne({ where: { id: contactId } });
  
      if (!user || !contact) {
        return undefined; // Handle user or contact not found
      }
  
      const existingUserContact = user.contacts.find(c => c.contact.id === contactId);
  
      if (!existingUserContact) {
        const newContact = new UserContact();
        newContact.user = user;
        newContact.contact = contact;
        newContact.messages = []; // Initialize with empty messages array
        await this.userContactRepository.save(newContact);
  
        user.contacts.push(newContact);
        await this.usersRepository.save(user);
      }
  
      // const userDto = new CreateUserDto(); // ... populate userDto properties
  
      const userContactDto = new UserContact(); // ... populate userContactDto properties (if applicable)
  
      return {
        firstUser: user,
        secondUser: contact,
        userContact: userContactDto,
      };
    } catch (error) {
      console.error('Error adding contact:', error);
      return undefined;
    }
  }

  async getUserContacts(userId: number): Promise<UserContact[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['contacts' , 'contacts.userContact', 'userContact', 'contacts.userContact.messages', ],
    });

    if (user) {
      return user.contacts; // Return the array of User objects representing contacts
    } else {
      return []; // Return empty array if user not found
    }
  }
}


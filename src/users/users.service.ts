import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserContact } from './entities/usercontact.entity';
import { Message } from 'src/chat/entities/message.entity';

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


  async addContact(userId: number, contactId: number): Promise<{ firstUser: any; secondUser: User; userContact: UserContact | undefined } | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['contacts', 'contacts.contact'] });
      const contact = await this.usersRepository.findOne({ where: { id: contactId }, relations: ['contacts', 'contacts.contact'] });
  
      if (!user || !contact) {
        return undefined; 
      }
    
      const userContactsArray = user.contacts.map(contact => ({...contact}));

      const existingUserContact = userContactsArray.find(contact => contact.contact.id === contactId);
      
      const newContact = new UserContact();
      if (!existingUserContact) {
        console.log('Creating new contact');
        newContact.user = user;
        newContact.contact = contact;
        newContact.messages = []; 
        const newContact2 = new UserContact();
        newContact2.contact = user;
        newContact2.user = contact;
        newContact2.messages = []; 

        await this.userContactRepository.save(newContact);
        await this.userContactRepository.save(newContact2);
      }
  
      return {
        firstUser: user,
        secondUser: contact,
        userContact: newContact,
      };
    } catch (error) {
      console.error('Error adding contact:', error);
      return undefined;
    }
  }

  async getUserContacts(userId: number): Promise<UserContact[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['contacts', 'contacts.contact', 'contacts.messages', 'contacts.messages.sender', 'contacts.messages.receiver'],
    });

    if (user) {
      return user.contacts;
    } else {
      return []; 
    }
  }

  async getContactMessages(userId: number, contactId: number): Promise<Message[]>{
    
    const userContacts = await this.getUserContacts(userId);
    const searchedContact = userContacts.find(contact => contact.contact.id == contactId)
    if(!searchedContact){
      return []
    }

    return searchedContact.messages
  }
}


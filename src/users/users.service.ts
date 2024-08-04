import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserContact } from './entities/usercontact.entity';
import { Message } from 'src/chat/entities/message.entity';
import { Intership } from 'src/intership/entities/intership.entity';
import { IntershipApplication } from 'src/intership/entities/intershipApplication.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { instanceToPlain } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserContact)
    private userContactRepository: Repository<UserContact>,
    @InjectRepository(Intership)
    private intershipRepository: Repository<Intership>,
    @InjectRepository(IntershipApplication)
    private intershipApplicationRepository: Repository<IntershipApplication>,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    ) {}
  
  async create(createUserDto: CreateUserDto) {
      try {
        const existingEmail = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
        console.log("inside");
        if (existingEmail) {
          HttpStatus.CONFLICT;
          return { status: "error", message: "Email already exists"};
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPassword;
        const user = this.usersRepository.create(createUserDto);
        await this.usersRepository.save(user);
    
        return { status: "success", data: user };
      } catch(err) {
        console.error(err);
        return { status: "error", message: err.message };
      }
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
    
    await this.usersRepository.update(id, {...updateUserDto});

    return { message: "User updated successfully", data: updateUserDto };
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
      console.log('User:', user);
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
      const updatedUser = await this.usersRepository.findOne({ where: { id: userId }, relations: ['contacts', 'contacts.contact'] });
      console.log('Updated user:', updatedUser);
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

    console.log('User:', user);

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

  async getUserContact(userId: number, contactId: number): Promise<UserContact | undefined> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const contact = await this.usersRepository.findOne({ where: { id: contactId } });

    const userContact = await this.userContactRepository.findOne({
      where: {
        user,
        contact,
      },
      relations: ['messages'],
    });

    if(userContact){
      return userContact
    }
    return undefined;
  }

  async createIntership(userId: number, intership: Intership) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['company'] });
    console.log('User:', user);
    if (!user || !user.company) {
      return undefined;
    }
    console.log(user);
    const place = user.location;
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (Note: January is 0)
    const year = date.getFullYear();
    const postedDate = `${day}-${month}-${year}`;
    const newIntership = await this.intershipRepository.create({ ...intership, postedDate, place });
    newIntership.company = user.company;
    console.log('New intership:', newIntership);

    await this.intershipRepository.save(newIntership);

    return intership;
  }

  async getPostedInterships(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['company', 'company.interships'] });

    console.log('User:', user);
    if (!user || !user.company) {
      return undefined;
    }

    return user.company.interships;
  }
    
  async applyToIntership(userId: number, intershipId: number, file: Express.Multer.File) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['applications'] });
    if(user?.role === 'company'){
      return { status: "error", message: "Companies cannot apply to interships" };
    }
    const intership = await this.intershipRepository.findOne({ where: { id: intershipId }, relations: ['appliedUsers']});

    if (!user || !intership) {
      return undefined;
    }

    const existingApplication = user.applications.find(application => application.intership.id === intershipId);
    if (existingApplication) {
      return existingApplication;
    }
    const application = new IntershipApplication();
    await this.cloudinaryService.uploadFile(file).then((result) => {
      application.cv = result.url;
    });
    application.intership = intership;
    application.user = user;
    application.status = 'in review';
    application.date = `${new Date().toLocaleDateString()}`;
    intership.applicants = intership.appliedUsers.length;
    await this.intershipApplicationRepository.save(application);
    intership.appliedUsers.push(user);
    await this.intershipRepository.save(intership);
    return { status: "success", data: application };
  }

  async getAppliedInterships(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['applications', 'applications.intership'] });

    if (!user) {
      return undefined;
    }

    return user.applications;
  }

  async removeIntershipApplication(userId: number, intershipId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['applications'] });
    const intership = await this.intershipRepository.findOne({ where: { id: intershipId }, relations: ['appliedUsers'] });

    if (!user || !intership) {
      return undefined;
    }

    const application = user.applications.find(application => application.intership.id === intershipId);
    if (!application) {
      return undefined;
    }

    await this.intershipApplicationRepository.delete(application.id);
    intership.appliedUsers = intership.appliedUsers.filter(user => user.id !== userId);
    await this.intershipRepository.save(intership);
    return user;
  }

  async updateUserInfo(userId: number, updateInfo: User) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      return undefined;
    }

    await this.usersRepository.update(userId, updateInfo);

    const userDto = instanceToPlain(user) as User;

    return { status: "success", data: { ...userDto, ...updateInfo}};
  }
}


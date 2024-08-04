import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'
import { Message } from 'src/chat/entities/message.entity';
import { UserContact } from './entities/usercontact.entity';
import { Intership } from 'src/intership/entities/intership.entity';
import { IntershipApplication } from 'src/intership/entities/intershipApplication.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Company } from 'src/company/entities/company.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Message, UserContact, Intership, IntershipApplication, Company]), CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}

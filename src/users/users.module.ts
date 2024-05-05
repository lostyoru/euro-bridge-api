import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'
import { Message } from 'src/chat/entities/message.entity';
import { UserContact } from './entities/usercontact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, UserContact])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}

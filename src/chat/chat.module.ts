import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatService } from './chat.service';
import { Message } from 'src/chat/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserContact } from 'src/users/entities/usercontact.entity';

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([Message, User, UserContact])],
    providers: [ChatGateway, ChatService],
})

export class ChatModule {}
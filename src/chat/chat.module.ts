import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatService } from './chat.service';
// import { Message } from 'src/messages/entities/message.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { Message } from 'src/chat/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [UsersModule, MessagesModule, TypeOrmModule.forFeature([Message, User])],
    providers: [ChatGateway, ChatService],
})

export class ChatModule {}
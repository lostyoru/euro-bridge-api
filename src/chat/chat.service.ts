// chat.service.ts (partially updated)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createMessage(senderId: number, receiverId: number, content: string): Promise<Message | undefined> {
    const sender = await this.usersRepository.findOne({ where: { id: senderId } });
    const receiver = await this.usersRepository.findOne({ where: { id: receiverId } });

    if (sender && receiver) {
      const message = new Message();
      message.content = content;
      message.sender = sender;
      message.receiver = receiver;
      return await this.messageRepository.save(message);
    } else {
      return undefined; 
    }
  }


}
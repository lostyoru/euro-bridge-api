import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../chat/entities/message.entity';
import { User } from '../users/entities/user.entity'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createMessage(senderId: number, receiverId: number, content: string): Promise<Message> {
    const sender = await this.userRepository.findOne({
      where: {
        id: senderId
      }
    });
    const receiver = await this.userRepository.findOne({
      where: {
        id: receiverId
      }
    });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const message = new Message();
    message.content = content;
    message.createdAt = new Date();
    message.sender = sender;
    message.receiver = receiver;

    return await this.messageRepository.save(message);
  }
}
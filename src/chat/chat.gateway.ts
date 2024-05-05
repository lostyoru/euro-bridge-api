import { Injectable } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/chat/entities/message.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service'; // Import the user service

const onlineUsers = new Map<string, string[]>(); // Stores emails and their connected socket IDs

@Injectable()
@WebSocketGateway()
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService, // Inject UserService
  ) {}

  @SubscribeMessage('join')
  async handleJoin(client: Socket, email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email); // Find user by email

    if (!user) {
      // Handle case where user is not found (optional: send error event)
      return;
    }

    if (!onlineUsers.has(email)) {
      onlineUsers.set(email, []);
    }
    onlineUsers.get(email).push(client.id); // Store socket IDs for the user
    client.data.userId = user.data.id; // Store user ID on client socket for message creation
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(client: Socket, recipientEmail: string, content: string): Promise<void> {
    const senderId = client.data.userId; // Get sender ID from stored data
    const recipient = await this.usersService.findOneByEmail(recipientEmail);

    if (!recipient) {
      // Handle case where recipient is not found (optional: send error event)
      return;
    }

    const message = await this.chatService.createMessage(senderId, recipient.data.id, content); // Use sender ID and recipient ID

    if (onlineUsers.has(recipientEmail)) {
      for (const socketId of onlineUsers.get(recipientEmail)) {
        client.to(socketId).emit('message', message); // Broadcast to recipient's sockets
      }
    }
  }

  // ... other methods (unchanged)
}

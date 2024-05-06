// import { Injectable } from '@nestjs/common';
// import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
// import { Socket } from 'socket.io';
// import { ChatService } from './chat.service';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Message } from 'src/chat/entities/message.entity';
// import { Repository } from 'typeorm';
// import { UsersService } from '../users/users.service'; // Import the user service

// const onlineUsers = new Map<string, string[]>(); // Stores emails and their connected socket IDs

// @Injectable()
// @WebSocketGateway()
// export class ChatGateway {
//   constructor(
//     private readonly chatService: ChatService,
//     @InjectRepository(Message)
//     private readonly messageRepository: Repository<Message>,
//     private readonly usersService: UsersService, // Inject UserService
//   ) {}

//   @SubscribeMessage('join')
//   async handleJoin(client: Socket, email: string): Promise<void> {
//     const user = await this.usersService.findOneByEmail(email); // Find user by email

//     if (!user) {
//       // Handle case where user is not found (optional: send error event)
//       return;
//     }

//     if (!onlineUsers.has(email)) {
//       onlineUsers.set(email, []);
//     }
//     onlineUsers.get(email).push(client.id); // Store socket IDs for the user
//     client.data.userId = user.data.id; // Store user ID on client socket for message creation
//   }

//   @SubscribeMessage('send-message')
//   async handleSendMessage(client: Socket, recipientEmail: string, content: string): Promise<void> {
//     const senderId = client.data.userId; // Get sender ID from stored data
//     const recipient = await this.usersService.findOneByEmail(recipientEmail);

//     if (!recipient) {
//       // Handle case where recipient is not found (optional: send error event)
//       return;
//     }

//     const message = await this.chatService.createMessage(senderId, recipient.data.id, content); // Use sender ID and recipient ID

//     if (onlineUsers.has(recipientEmail)) {
//       for (const socketId of onlineUsers.get(recipientEmail)) {
//         client.to(socketId).emit('message', message); // Broadcast to recipient's sockets
//       }
//     }
//   }

//   // ... other methods (unchanged)
// }

import { Injectable } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service'; // Optional (if ChatService is used)
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/chat/entities/message.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { MessageService } from 'src/messages/messages.service';
import { User } from 'src/users/entities/user.entity';
import { sendMessageType } from 'types/sendMessageType';
import { UserContact } from 'src/users/entities/usercontact.entity';

const onlineUsers = new Map<string, string[]>(); // Stores emails and their connected socket IDs

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } }) // Allow CORS (development only)
export class ChatGateway {
  constructor(
    private readonly usersService: UsersService,
    private readonly messageService: MessageService,
    private readonly chatService: ChatService, // Optional (if ChatService is used)
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserContact)
    private readonly userContactRepository: Repository<UserContact>,

  ) {}

  @SubscribeMessage('join')
  async handleJoin(client: Socket, email: string): Promise<void> {
    // console.log(client);
    const user = await this.usersRepository.findOne({ 
      where: { email: email }
    });
    // console.log(user)
    if (!user) {
      // Handle case where user is not found (optional: send error event)
      return;
    }
  
    if (!onlineUsers.has(email)) {
      onlineUsers.set(email, []);
    }
    onlineUsers.get(email).push(client.id); // Store socket IDs for the user
    client.data.userId = user.id; // Store user ID on client socket for message creation
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(client: Socket, {recipientEmail, content}: sendMessageType ): Promise<void> {
    console.log("message")

    const senderId = client.data.userId;
    console.log("sender")
    console.log(senderId);
    const recipient = await this.usersRepository.findOne({
      where: {
        email: recipientEmail // 'email' should be the actual column name in the database
      }
    });
    console.log(recipient);

    if (!recipient) {
      // Handle case where recipient is not found (optional: send error event)
      return;
    }

    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: senderId
        }
      })
      const newMessage = new Message();
      newMessage.content= content;
      newMessage.createdAt = new Date();
      newMessage.receiver = recipient;
      newMessage.sender = user;
      await this.messageRepository.save(newMessage)
      console.log(newMessage)
      console.log(onlineUsers)
      
      const userContacts = await this.userContactRepository.find({
        where: {
          user: user,
          contact: recipient 
        } || {
          user: recipient,
          contact: user
        }
      })
      console.log(userContacts)
      userContacts.forEach(async (userContact) => {
        userContact.messages.push(newMessage);
        console.log(userContact)
        await this.userContactRepository.save(userContact);
      })
    
      if (onlineUsers.has(recipientEmail)) {
        console.log("recipient is online")
        for (const socketId of onlineUsers.get(recipientEmail)) {
          console.log("broadcats")
          client.to(socketId).emit('message', newMessage); // Broadcast to recipient's sockets
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle the error appropriately (e.g., display an error message to the user)
    }
  }

  // ... other methods (unchanged)
}


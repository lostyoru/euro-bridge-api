import { Injectable } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/chat/entities/message.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { sendMessageType } from 'types/sendMessageType';
import { UserContact } from 'src/users/entities/usercontact.entity';


const onlineUsers = new Map<string, string[]>(); 

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } }) 
export class ChatGateway {
  constructor(
    private readonly usersService: UsersService,
    private readonly chatService: ChatService, 
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserContact)
    private readonly userContactRepository: Repository<UserContact>,

  ) {}

  @SubscribeMessage('join')
  async handleJoin(client: Socket, email: string): Promise<void> {

    const user = await this.usersRepository.findOne({ 
      where: { email: email }
    });

    if (!user) {

      return;
    }
  
    if (!onlineUsers.has(email)) {
      onlineUsers.set(email, []);
    }
    onlineUsers.get(email).push(client.id); 
    client.data.userId = user.id; 
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(client: Socket, {recipientEmail, content}: sendMessageType ): Promise<void> {
    console.log("message")

    const senderId = client.data.userId;
    console.log("sender")
    console.log(senderId);
    const recipient = await this.usersRepository.findOne({
      where: {
        email: recipientEmail 
      }
    });

    if (!recipient) {

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
      newMessage.createdAt = `${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
      newMessage.receiver = recipient;
      newMessage.sender = user;
      await this.messageRepository.save(newMessage);

      console.log(onlineUsers)

      const userContact = await this.usersService.getUserContact(user.id, recipient.id);
      if(userContact){
        userContact.lastMessage = content;
        userContact.lastMessageTime = `${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        userContact.messages.push(newMessage);
        await this.userContactRepository.save(userContact);
      }
      const recipientContact = await this.usersService.getUserContact(recipient.id, user.id);
      console.log("recipient contact" , recipientContact);
      if(recipientContact){
        recipientContact.lastMessage = content;
        recipientContact.lastMessageTime = `${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        recipientContact.messages.push(newMessage);
        await this.userContactRepository.save(recipientContact);
      }



      if (onlineUsers.has(recipientEmail)) {
        console.log("recipient is online")
        for (const socketId of onlineUsers.get(recipientEmail)) {
          console.log("broadcats")
          client.to(socketId).emit('message', newMessage); 
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
    }
  }


}


import { Message } from "src/chat/entities/message.entity";
export class UserContactDTO {
    id?: number; 
    lastMessage?: string; 
    lastMessageTime?: string; 
    messages: Message[];
  }
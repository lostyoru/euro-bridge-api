import { Message } from "src/chat/entities/message.entity";
export class UserContactDTO {
    id?: number; // Include ID if needed
    lastMessage?: string; // Last message content (optional)
    lastMessageTime?: string; // Last message timestamp (optional)
    messages: Message[];
  }
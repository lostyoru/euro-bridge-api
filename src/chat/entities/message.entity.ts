import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserContact } from '../../users/entities/usercontact.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sentMessages) // Sender
  @JoinColumn({ name: "senderId" }) // Optional: customize join column name
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages) // Receiver
  @JoinColumn({ name: "receiverId" }) // Optional: customize join column name
  receiver: User;

  @ManyToOne(() => UserContact , userContact => userContact.messages)
  userContact: UserContact;
}
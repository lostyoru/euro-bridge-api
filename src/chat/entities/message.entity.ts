import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserContact } from '../../users/entities/usercontact.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  createdAt: string;

  @ManyToOne(() => User, (user) => user.sentMessages) // Sender
  @JoinColumn({ name: "senderId" }) // Optional: customize join column name
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages) // Receiver
  @JoinColumn({ name: "receiverId" }) // Optional: customize join column name
  receiver: User;

  @ManyToMany(() => UserContact , userContact => userContact.messages)
  @JoinTable(
    {
      name: 'messages_user_contact', // Join table name
      joinColumn: { name: 'messageId', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'UserContactId', referencedColumnName: 'id' },
    }
  )
  userContact: UserContact;

}
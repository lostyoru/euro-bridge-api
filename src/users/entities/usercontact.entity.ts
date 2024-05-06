import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne} from 'typeorm';
// import { User } from './user.entity';
import { Message } from '../../chat/entities/message.entity';
import { User } from './user.entity';

@Entity()
export class UserContact {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: ''})
  lastMessage: string;

  @Column({ default: ''})
  lastMessageTime: string;

  @ManyToOne(() => User, (user) => user.contacts)
  user: User;

  @ManyToOne(() => User, user => user.contacts)
  contact: User;

  @OneToMany(() => Message, message => message.userContact, {eager: true})
  messages: Message[];

}
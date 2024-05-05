import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
// import { Message } from "../../messages/entities/message.entity";
// import { Exclude } from 'class-transformer';
import  { Role } from "../dto/role";
import { Message } from "../../chat/entities/message.entity";
import { UserContact } from "./usercontact.entity";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role: Role;

    @Column({ default: 'Recruiter at Nomad'})
    work: string;

    @Column({ default: 'https://res.cloudinary.com/dekmr7qlp/image/upload/v1701910051/default-pfp_uc7yn8.jpg'})
    image: string;

    @Column({ default: 'https://res.cloudinary.com/dekmr7qlp/image/upload/v1714787066/cover_xfclbr.jpg'})
    coverImage: string;

    // @OneToMany(() => Message, (message) => message.sender)
    // messagesSent: Message[];
  
    // @OneToMany(() => Message, (message) => message.recipient)
    // messagesReceived: Message[];
  
    // @ManyToMany(() => User, (user) => user.contacts) // ManyToMany for contacts
    // @JoinTable({ // Join table configuration for contacts
    //   name: 'user_contacts',
    //   joinColumn: { name: 'userId', referencedColumnName: 'id' },
    //   inverseJoinColumn: { name: 'contactId', referencedColumnName: 'id' },
    // })
    // contacts: User[]; // Array of User objects representing contacts

    @OneToMany(() => UserContact, userContact => userContact.user)
    contacts: UserContact[];

    @ManyToOne(() => UserContact, (userContact) => userContact.messages) // New relationship
    userContact: UserContact;

    @OneToMany(() => Message, (message) => message.sender)
    sentMessages: Message[];

    @OneToMany(() => Message, (message) => message.receiver)
    receivedMessages: Message[];

    @Column({ default: ''})
    refreshToken: string;

    
}

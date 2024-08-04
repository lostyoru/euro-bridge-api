import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn,} from "typeorm";
import { Message } from "../../chat/entities/message.entity";
import { UserContact } from "./usercontact.entity";
import { IntershipApplication } from "src/intership/entities/intershipApplication.entity";
import { Company } from "src/company/entities/company.entity";
import { Exclude } from 'class-transformer';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Exclude({ toPlainOnly: true })
    @Column()
    password: string;

    @Column({ default: 'intership_seeker' })
    role: string;

    @Column({ default: 'Recruiter at Nomad'})
    work: string;

    @Column({ default: 'https://res.cloudinary.com/dekmr7qlp/image/upload/v1701910051/default-pfp_uc7yn8.jpg'})
    image: string;

    @Column({ default: ''})
    about: string;

    @Column({ default: ''})
    phone: string;

    @Column({ default: ''})
    location: string;

    @Column({ default: ''})
    languages: string;

    @Column({ default: ''})
    gender: string;

    @Column({ default: ''})
    dob: string;

    @Exclude({ toPlainOnly: true })
    @OneToOne(() => Company, (company) => company.user, {eager: true})
    @JoinColumn()
    company: Company;

    @Column({ default: 'https://res.cloudinary.com/dekmr7qlp/image/upload/v1714787066/cover_xfclbr.jpg'})
    coverImage: string;

    @Exclude({ toPlainOnly: true })
    @OneToMany(() => IntershipApplication, (application) => application.user, {eager: true})
    applications: IntershipApplication[];

    // @Exclude({ toPlainOnly: true })
    @OneToMany(() => UserContact, userContact => userContact.user)
    contacts: UserContact[];

    @Exclude({ toPlainOnly: true })
    @OneToMany(() => Message, (message) => message.sender)
    sentMessages: Message[];

    @Exclude({ toPlainOnly: true })
    @OneToMany(() => Message, (message) => message.receiver)
    receivedMessages: Message[];

    @Exclude({ toPlainOnly: true })
    @Column({ default: ''})
    refreshToken: string;


}

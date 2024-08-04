import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from 'typeorm';
import { Intership } from './intership.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class IntershipApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Intership, intership => intership.appliedUsers)
    @JoinTable()
    intership: Intership;

    @ManyToOne(() => User, user => user.applications)
    @JoinTable()
    user: User;

    @Column()
    jobTitle: string;

    @Column()
    cv: string;

    @Column({ default: 'in review'})
    status: string;

    @Column({ default: ''})
    email: string;

    @Column({ default: ''})
    phone: string;

    @Column({ default: ''})
    linkedin: string;

    @Column({ default: ''})
    portfolio: string;

    @Column({ default: ''})
    additional: string;

    @Column()
    date: string;
}
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Intership } from 'src/intership/entities/intership.entity';

@Entity() 
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Intership, intership => intership.company)
    interships: Intership[];

    @OneToOne(() => User, user => user.company)
    @JoinColumn()
    user: User;
}

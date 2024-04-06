import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import  { Role } from "../dto/role";
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

    @Column()
    age: number;

    @Column()
    username: string;

    @Column({ default: 'user' })
    roles: Role;

    @Column()
    isVerified: boolean;

    @Column({ default: ''})
    refreshToken: string;
}

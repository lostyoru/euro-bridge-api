import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Company } from "src/company/entities/company.entity";
import { IsOptional } from "class-validator";
@Entity()
export class Intership {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    place: string;
    
    @Column()
    type: string;

    @Column()
    fields: string;

    @Column()
    description: string;

    @Column()
    duration: string;

    @Column()
    qualifications: string;

    @Column()
    whoyouare: string;

    @IsOptional()
    @Column({ default: 'open' })
    finalDate: string;

    @IsOptional()
    @Column({ default: 'open' })
    postedDate: string;

    @ManyToMany(() => User, (user) => user.applications) 
    @JoinTable()
    appliedUsers: User[];

    @Column( {default: 0})
    applicants: number;

    @ManyToOne(() => Company, company => company.interships)
    company: Company;

}


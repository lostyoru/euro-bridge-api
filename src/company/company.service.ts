import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CompanyService {

    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async createCompany(user: User) {
        if (user.company) {
            return user.company;
        } else {
            const company = new Company();
            company.user = user;
            company.interships = []; 


            const savedCompany = await this.companyRepository.save(company);
            console.log("Company saved", savedCompany);

            user.company = savedCompany;
            await this.usersRepository.save(user);
            
            return savedCompany;
        }
    }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Intership } from './entities/intership.entity';
import { Company } from 'src/company/entities/company.entity';
import { CreateIntershipDto } from './dto/create-intership.dto';
import { IntershipApplication } from './entities/intershipApplication.entity';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class IntershipService {
    
    constructor(
        @InjectRepository(Intership)
        private readonly intershipRepository: Repository<Intership>,
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(IntershipApplication)
        private readonly intershipApplicationRepository: Repository<IntershipApplication>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    
    async createIntership(createIntershipDto: CreateIntershipDto) {
        const company = await this.companyRepository.findOne({
            where: { id: createIntershipDto.company }
        });
        const intership = new Intership();
        intership.company = company;
        intership.appliedUsers = [];
        intership.title = createIntershipDto.title;
        intership.place = createIntershipDto.place;
        intership.fields = createIntershipDto.fields;
        intership.description = createIntershipDto.description;
        intership.duration = createIntershipDto.duration;
        intership.qualifications = createIntershipDto.qualifications;
        intership.whoyouare = createIntershipDto.whoyouare;
        intership.finalDate = createIntershipDto.finalDate;
        intership.postedDate = createIntershipDto.postedDate;
        await this.intershipRepository.save(intership);
    }

    async removeIntership(id: number) {
        await this.intershipRepository.delete(id);
    }

    async findAll() {
        const interships = await this.intershipRepository.find({
            relations: ['company', 'company.user']
        });
        return interships;
    }

    async findOne(id: number) {
        const intership = await this.intershipRepository.findOne({
            where: { id },
            relations: ['company', 'company.user']
        });
        return intership;
    }


    async getAppliedUsers(id: number) {
        const intership = await this.intershipRepository.findOne({
            where: { id },
            relations: ['appliedUsers']
        });
        return intership.appliedUsers;
    }

    async changeIntershipApplicationStatus(intershipId: number, userId: number, status: string) {
        const intership = await this.intershipRepository.findOne({
            where: { id: intershipId }
        });
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        const intershipApplication = await this.intershipApplicationRepository.findOne({
            where: { intership, user },
            relations: ['intership', 'user']
        });

        intershipApplication.status = status;
        await this.intershipApplicationRepository.save(intershipApplication);

        return intershipApplication;

    }

}

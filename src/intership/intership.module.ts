import { Module } from '@nestjs/common';
import { IntershipService } from './intership.service';
import { IntershipController } from './intership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Intership } from './entities/intership.entity';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import { IntershipApplication } from './entities/intershipApplication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Intership, User, Company, IntershipApplication])],
  controllers: [IntershipController],
  providers: [IntershipService],
  exports: [IntershipService],
})
export class IntershipModule {}

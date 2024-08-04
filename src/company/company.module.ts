import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { User } from '../users/entities/user.entity';
import { IntershipModule } from 'src/intership/intership.module';
import { UsersModule } from 'src/users/users.module'
@Module({
  imports: [UsersModule,TypeOrmModule.forFeature([Company, User, IntershipModule])],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}

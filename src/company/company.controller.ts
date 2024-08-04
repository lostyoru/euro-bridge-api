import { Controller } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Post, Param } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService,
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Post("/:id")
  async createCompany(@Param('id') id: number) {
    const user = await this.usersRepository.findOne({
      where: { id }
    });
    return this.companyService.createCompany(user);
    
  }
}

import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { IntershipService } from './intership.service';
import { CreateIntershipDto } from './dto/create-intership.dto';

@Controller('intership')
export class IntershipController {
  constructor(private readonly intershipService: IntershipService) {}

  @Post('create')
  createIntership(createIntershipDto: CreateIntershipDto) {
    return this.intershipService.createIntership(createIntershipDto);
  }

  @Get('all')
  findAll() {
    return this.intershipService.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: number){
    return this.intershipService.findOne(id);
  }

  @Get('appliedUsers/:id')
  getAppliedUsers(id: number) {
    return this.intershipService.getAppliedUsers(id);
  }

  @Delete('/:id')
  removeIntership(id: number) {
    return this.intershipService.removeIntership(id);
  }

  @Put('changeStatus')
  changeIntershipApplicationStatus(intershipId: number, userId: number, status: string) {
    return this.intershipService.changeIntershipApplicationStatus(intershipId, userId, status);
  }
}

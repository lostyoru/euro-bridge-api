import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AddContactDto } from './dto/AddContactDto.dto';
import { UserContact } from './entities/usercontact.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('addcontact')
  async addContact(@Body() addContactDto: AddContactDto): Promise<any> {
    const { userId, contactId } = addContactDto;
    const user = await this.usersService.addContact(userId, contactId);
    return user; // You can return a success message or the updated user object
  }

  @Get(':id/contacts')
  async getUserContacts(@Param('id') id: number): Promise<UserContact[]> {
    const contacts = await this.usersService.getUserContacts(id);
    return contacts;
  }

  @Get(':userid/contacts/:contactid/messages')
  async getContactMessages(@Param('id') userId: number, @Param('contactid') contactId: number){
    return this.usersService.getContactMessages(userId, contactId)
  }

  @Get(':userid/contacts/:contactid')
  async getUserContact(@Param('userid') userId: number, @Param('contactid') contactId: number){
    return this.usersService.getUserContact(userId, contactId)
  }
}

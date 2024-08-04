import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AddContactDto } from './dto/AddContactDto.dto';
import { UserContact } from './entities/usercontact.entity';
import { User } from './entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

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
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const imageUrl = (await this.cloudinaryService.uploadFile(file)).url;
      updateUserDto = { ...updateUserDto, image: imageUrl };
    }


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
    return user; 
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

  @Post('users/intership/:intershipId/apply')
  async applyToIntership(@Param('intershipId') intershipId: number, @Body() applyDto: { userId: number, file: Express.Multer.File }) {
    return this.usersService.applyToIntership(intershipId, applyDto.userId, applyDto.file);
  }

  @Put("user/:userId")
  async updateUserInfo(@Param('userId') userId: number, @Body() updateUserDto: User) {
    console.log("updateUserDto : ", updateUserDto);
    return this.usersService.updateUserInfo(userId, updateUserDto);
  }

  @Post('/:userId')
  async createIntership(@Param('userId') userId: number, @Body() createIntershipDto: any) {

    return this.usersService.createIntership(userId, createIntershipDto);
  }

  @Get('/:userId/company/postedinterships')
  async getPostedInterships(@Param('userId') userId: number) {
    return this.usersService.getPostedInterships(userId);
  }

}

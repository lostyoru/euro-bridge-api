import { Controller} from '@nestjs/common';
import { MessageService } from './messages.service';
// import { CreateMessageDto } from './dto/create-message.dto';
// import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessageService) {}

}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatRoomDto } from './dto/chat.room.dto';
import { ChatRoom } from './entities/chat.room.entity';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  create(@Body() chatRoomDto: CreateChatRoomDto) {
    return this.chatService.create(chatRoomDto);
  }

  @ApiOperation({ summary: '모든 방 조회' })
  @Get()
  findAllChatRoom(): Promise<ChatRoom[]> {
    return this.chatService.findAllChatRoom();
  }
}

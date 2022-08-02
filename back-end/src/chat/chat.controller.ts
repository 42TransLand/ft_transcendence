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
import { ChatRoom } from './entities/chat.room.entity';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '채팅방 생성' })
  @Post('create')
  createChatRoom(@Body() chatRoomDto: CreateChatRoomDto) {
    return this.chatService.createChatRoom(chatRoomDto);
  }

  @ApiOperation({ summary: '모든 방 조회' })
  @Get()
  findAllChatRoom(): Promise<ChatRoom[]> {
    return this.chatService.findAllChatRoom();
  }

  @Get('/:id')
  findChatRoomById(@Param('id') id: string): Promise<ChatRoom> {
    return this.chatService.findChatRoomById(id);
  }
}

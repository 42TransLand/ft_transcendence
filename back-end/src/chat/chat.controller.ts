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
import { UpdateChatPasswordDto } from './dto/update.chat.password.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '채팅방 생성' })
  @Post('create')
  create(@Body() chatRoomDto: CreateChatRoomDto) {
    return this.chatService.create(chatRoomDto);
  }

  @ApiOperation({ summary: '모든 방 조회' })
  @Get()
  findAllChatRoom(): Promise<ChatRoom[]> {
    return this.chatService.findAllChatRoom();
  }

  // User 구현되면, geUser로 user 받아와서 방장인지 확인하고, 방장이면 비밀번호를 변경하는 기능을 구현해야 함.
  @ApiOperation({ summary: '비밀번호 수정/삭제' })
  @Patch('/:id/password')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePassword: UpdateChatPasswordDto,
  ) {
    return this.chatService.updatePassword(
      id,
      updatePassword.type,
      updatePassword.password,
    );
  }
}

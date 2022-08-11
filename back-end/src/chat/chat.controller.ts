import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatRoom } from './entities/chat.room.entity';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';
import { UpdateChatPasswordDto } from './dto/update.chat.password.dto';
import { UpdateRoleDto } from './dto/update.role.dto';
import { ChatRoomDto } from './dto/chat.room.dto';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get.user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '채팅방 생성' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채팅방일 경우' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @Post('/create')
  createChatRoom(
    @GetUser() user: User,
    @Body() chatRoomDto: CreateChatRoomDto,
  ): Promise<void> {
    return this.chatService.createChatRoom(user, chatRoomDto);
  }

  @ApiOperation({ summary: '채팅방 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채팅방일 경우' })
  @Get('/:id')
  findChatRoomById(@Param('id') id: string): Promise<ChatRoom> {
    return this.chatService.findChatRoomById(id);
  }

  @ApiOperation({ summary: '모든 채팅방 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @Get()
  findAllChatRoom(): Promise<ChatRoom[]> {
    return this.chatService.findAllChatRoom();
  }

  // User 구현되면, geUser로 user 받아와서 방장인지 확인하고, 방장이면 비밀번호를 변경하는 기능을 구현해야 함.
  @ApiOperation({ summary: '비밀번호 수정/삭제' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '없는 채팅방일 경우' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @Patch('/:id')
  updatePassword(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() { password }: UpdateChatPasswordDto,
  ): Promise<void> {
    return this.chatService.updatePassword(id, user, password);
  }

  @ApiOperation({ summary: '채팅방 유저 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @Get('users/:id')
  @ApiOperation({ summary: '채팅방 유저 역할 변경' })
  @Patch('/:id/role')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.chatService.updateRole(id, updateRoleDto);
  }

  // 게임 유저 나감

  @ApiOperation({ summary: '채팅방 참석' })
  @Post('/join/:id/:nickname')
  joinChatRoom(@Param('id') id: string, @Body() chatRoomDto: ChatRoomDto) {
    return this.chatService.joinChatRoom(id, chatRoomDto);
  }

  @ApiOperation({ summary: '채팅방 나가기' })
  @Delete('/:id/leave')
  leaveChatRoom(@Param('id') id: string, @Body() chatRoomDto: ChatRoomDto) {
    return this.chatService.leaveChatRoom(id, chatRoomDto.nickname);
  }

  @ApiOperation({ summary: '채팅 보내기' })
  @Post('/:id/sendChat')
  sendChat(@Param('id') id: string, @Body() chatDto: ChatDto) {
    return this.chatService.sendChat(id, chatDto);
  }

  @ApiOperation({ summary: '해당 유저 음소거' })
  @Patch('/:id/users/:userName/mute')
  updateChatMute(
    @Body() { nickname }: ChatDto, // [TODO] GetUser() 로 대체될 부분
    @Param('id') id: string,
    @Param('userName') userName: string,
  ) {
    return this.chatService.updateChatMute(id, userName, nickname);
  }

  @ApiOperation({ summary: '해당 유저 음소거 해제' })
  @Patch('/:id/users/:userName/unMute')
  updateChatUnMute(
    @Body() { nickname }: ChatDto, // [TODO] GetUser() 로 대체될 부분
    @Param('id') id: string,
    @Param('userName') userName: string,
  ) {
    return this.chatService.updateChatUnMute(id, userName, nickname);
  }
}

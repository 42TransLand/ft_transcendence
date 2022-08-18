import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
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
import { ChatInfoDto } from './dto/chat.info.dto';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '채팅방 생성' })
  @ApiResponse({ status: 201, description: '성공' })
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
  findAllChatRoom(): Promise<ChatInfoDto[]> {
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
    @Body() { password, type }: UpdateChatPasswordDto,
  ): Promise<void> {
    return this.chatService.updatePassword(id, user, type, password);
  }

  @ApiOperation({ summary: '채팅방 유저 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @Get('/users/:id')
  findChatRoomUsers(@Param('id') id: string) {
    return this.chatService.findChatRoomUsers(id);
  }

  @ApiOperation({ summary: '채팅방 유저 역할 변경' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 401, description: '유저 권한이 잘못된 경우' })
  @ApiResponse({ status: 404, description: '없는 채팅방일 경우' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 409,
    description: 'admin으로 줄 유저가 이미 admin일 경우',
  })
  @Patch('/role/:id')
  updateRole(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<void> {
    return this.chatService.updateRole(id, user, updateRoleDto);
  }

  // 게임 유저 나감

  @ApiOperation({ summary: '채팅방 참석' })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 401, description: '유저 권한이 잘못된 경우' })
  @ApiResponse({ status: 404, description: '패스워드가 잘못된 경우' })
  @ApiResponse({ status: 409, description: '이미 채팅방에 접속한 경우' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @Post('/join/:id')
  joinChatRoom(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() { password }: ChatRoomDto,
  ): Promise<void> {
    return this.chatService.joinChatRoom(id, user, password);
  }

  @ApiOperation({ summary: '채팅방 나가기' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '채팅방에 없는 유저인 경우' })
  @Delete('/leave/:id')
  leaveChatRoom(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<string> {
    return this.chatService.leaveChatRoom(id, user);
  }

  @ApiOperation({ summary: '채팅방 강퇴' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 401, description: '권한이 없는 경우' })
  @ApiResponse({ status: 404, description: '채팅방, 유저 없는 경우' })
  @Delete('/kick/:id/:nickname')
  kickChatUser(
    @GetUser() user: User,
    @Param('id') id: string,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    return this.chatService.kickChatUser(id, user, nickname);
  }

  @ApiOperation({ summary: '채팅 보내기' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '음소거된 유저인 경우' })
  @ApiResponse({ status: 404, description: '채팅방에 없는 유저인 경우' })
  @Post('/send/:id/')
  sendChat(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() { content }: ChatDto,
  ): Promise<void> {
    return this.chatService.sendChat(id, user, content);
  }

  @ApiOperation({ summary: '해당 유저 음소거' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 401, description: '권한이 없는 경우' })
  @ApiResponse({ status: 404, description: '채팅방에 없는 유저인 경우' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @Patch('/mute/:id/:nickname')
  updateChatMute(
    @GetUser() user: User,
    @Param('id') id: string,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    return this.chatService.updateChatMute(id, user, nickname);
  }

  @ApiOperation({ summary: '해당 유저 음소거 해제' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '권한이 없는 경우' })
  @ApiResponse({ status: 404, description: '채팅방에 없는 유저인 경우' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @Patch('/unmute/:id/:nickname/')
  updateChatUnMute(
    @GetUser() user: User,
    @Param('id') id: string,
    @Param('nickname') nickname: string,
  ): Promise<void> {
    return this.chatService.updateChatUnMute(id, user, nickname);
  }
}

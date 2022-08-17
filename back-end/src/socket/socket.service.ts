import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from 'src/chat/chat.room.repository';
import { ChatUserRepository } from 'src/chat/chat.user.repository';
import { ChatJoinNotifyDto } from 'src/chat/dto/chat.join.notify.dto';
import { ChatLeaveNotifyDto } from 'src/chat/dto/chat.leave.notify.dto';
import { UserContext } from './class/user.class';
import { SocketEventName } from './game/constants/game.constants';

@Injectable()
export class SocketService {
  constructor(
    @InjectRepository(ChatRoomRepository)
    private readonly chatRoomRepository: ChatRoomRepository,
    @InjectRepository(ChatUserRepository)
    private readonly chatUserRepository: ChatUserRepository,
  ) {}

  handleJoinChatRoom(userInfo: UserContext): void {
    userInfo.socket.join(userInfo.chatRoom);
    userInfo.server
      .to(userInfo.chatRoom)
      .emit(SocketEventName.CHAT_JOIN_NOTIFY, <ChatJoinNotifyDto>{
        nickname: userInfo.user.nickname,
        profileImg: userInfo.user.profileImg,
        id: userInfo.user.id,
      });
  }

  handleLeaveChatRoom(userInfo: UserContext): void {
    userInfo.socket.leave(userInfo.chatRoom);
    userInfo.server
      .to(userInfo.chatRoom)
      .emit(SocketEventName.CHAT_LEAVE_NOTIFY, <ChatLeaveNotifyDto>{
        nickname: userInfo.user.nickname,
      });
  }
}

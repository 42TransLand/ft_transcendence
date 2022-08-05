import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from 'src/chat/chat.room.repository';
import { ChatUserRepository } from 'src/chat/chat.user.repository';
import { UserContext } from './class/user.class';

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

    userInfo.server.to(userInfo.chatRoom).emit(
      'chat',
      JSON.stringify({
        nickname: userInfo.user.nickname,
        content: 'chatJoin',
      }),
    );
  }

  handleLeaveChatRoom(userInfo: UserContext): void {
    userInfo.socket.leave(userInfo.chatRoom);
    userInfo.server.to(userInfo.chatRoom).emit(
      'chat',
      JSON.stringify({
        nickname: userInfo.user.nickname,
        content: 'chatLeave',
      }),
    );
  }
}

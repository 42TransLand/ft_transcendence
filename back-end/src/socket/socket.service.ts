import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from 'http';
import { ChatRoomRepository } from 'src/chat/chat.room.repository';
import { ChatUserRepository } from 'src/chat/chat.user.repository';
import { ChatJoinNotifyDto } from 'src/socket/chat/dto/chat.join.notify.dto';
import { ChatLeaveNotifyDto } from 'src/socket/chat/dto/chat.leave.notify.dto';
import { ChatUserUpdateType } from './chat/constants/chat.user.update.type.enum';
import { ChatMessageNotifyDto } from './chat/dto/chat.message.notify.dto';
import { ChatUpdateProtectionNotifyDto } from './chat/dto/chat.update.protection.notify.dto';
import { ChatUpdateUserNotifyDto } from './chat/dto/chat.update.user.notify.dto';
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

  handleLeaveChatRoom(userInfo: UserContext, is_kick: boolean): void {
    if (is_kick) {
      userInfo.server
        .to(userInfo.chatRoom)
        .emit(SocketEventName.CHAT_UPDATE_USER_NOTIFY, <
          ChatUpdateUserNotifyDto
        >{
          nickname: userInfo.user.nickname,
          type: ChatUserUpdateType.KICK,
          status: true,
        });
    } else {
      userInfo.server
        .to(userInfo.chatRoom)
        .emit(SocketEventName.CHAT_LEAVE_NOTIFY, <ChatLeaveNotifyDto>{
          nickname: userInfo.user.nickname,
        });
    }
    userInfo.socket.leave(userInfo.chatRoom);
    userInfo.chatRoom = null;
  }

  handleSendDM(userInfo: UserContext, dmId: string, content: string) {
    userInfo.socket.join(dmId);
    userInfo.server.to(dmId).emit(SocketEventName.CHAT_MESSAGE_NOTIFY, <
      ChatMessageNotifyDto
    >{
      nickname: userInfo.user.nickname,
      content,
    });
  }

  handleChatMessage(
    server,
    nickname: string,
    chatId: string,
    content: string,
  ): void {
    server.to(chatId).emit(SocketEventName.CHAT_MESSAGE_NOTIFY, <
      ChatMessageNotifyDto
    >{
      nickname,
      content,
    });
  }

  handleUpdateChatType(server, chatRoomId: string, isChange: boolean) {
    server.to(chatRoomId).emit(SocketEventName.CHAT_UPDATE_PROTECTION_NOTIFY, <
      ChatUpdateProtectionNotifyDto
    >{
      status: isChange,
    });
  }

  handleUpdateChatUser(
    server,
    chatRoomId: string,
    nickname: string,
    type: ChatUserUpdateType,
    status: boolean,
  ) {
    server.to(chatRoomId).emit(SocketEventName.CHAT_UPDATE_USER_NOTIFY, <
      ChatUpdateUserNotifyDto
    >{
      nickname,
      type,
      status,
    });
  }
}

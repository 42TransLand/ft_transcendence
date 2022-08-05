import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { ChatRoomRepository } from 'src/chat/chat.room.repository';
import { ChatUserRepository } from 'src/chat/chat.user.repository';
import { ChatDto } from '../chat/dto/chat.dto';
import { UserContext } from './class/user.class';

@Injectable()
export class SocketService {
  constructor(
    @InjectRepository(ChatRoomRepository)
    private readonly chatRoomRepository: ChatRoomRepository,
    @InjectRepository(ChatUserRepository)
    private readonly chatUserRepository: ChatUserRepository,
  ) {}

  handleJoinChatRoom(client: Socket, roomId: string): string {
    client.join(roomId);
    return 'Joined the chatRoom';
  }

  handleLeaveChatRoom(server: Server, client: Socket, roomId: string): string {
    client.leave(roomId);
    return 'Leaved the chatRoom';
  }

  handleDisconnect(user: UserContext) {
    user.socket.rooms.forEach((room) => {
      user.socket.leave(room);
      user.server.to(room).emit(`${user.id}님이 나가셨습니다`);
    });
  }
}

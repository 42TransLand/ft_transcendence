import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { ChatRoomRepository } from 'src/chat/chat.room.repository';
import { ChatUserRepository } from 'src/chat/chat.user.repository';
import { ChatDto } from './game/dto/chat.dto';

@Injectable()
export class SocketService {
  constructor(
    @InjectRepository(ChatRoomRepository)
    private readonly chatRoomRepository: ChatRoomRepository,
    @InjectRepository(ChatUserRepository)
    private readonly chatUserRepository: ChatUserRepository,
  ) {}

  handleJoinChatRoom(client: Socket, id: string): string {
    client.join(id);

    return 'Joined the chatRoom';
  }

  handleLeaveChatRoom(server: Server, client: Socket, id: string): string {
    client.leave(id);
    return 'Leaved the chatRoom';
  }

  handleSendMessage(server: Server, client: Socket, chatdto: ChatDto): void {
    server.in(chatdto.id).emit('sendToClient', chatdto.message);
  }
}

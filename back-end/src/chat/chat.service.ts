import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from './chat.room.repository';
import { ChatRoomDto } from './dto/chat.room.dto';
import { ChatRoom } from './entities/chat.room.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomRepository)
    private readonly chatRepository: ChatRoomRepository,
  ) {}

  findAllChatRoom(): Promise<ChatRoom[]> {
    return this.chatRepository.findAllChatRoom();
  }
}

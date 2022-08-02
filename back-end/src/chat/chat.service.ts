import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from './chat.room.repository';
import { ChatRoomDto } from './dto/chat.room.dto';
import { ChatRoom } from './entities/chat.room.entity';
import { ChatType } from './constants/chat.type.enum';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomRepository)
    private readonly chatRepository: ChatRoomRepository,
  ) {}

  create(chatRoomDto: CreateChatRoomDto) {
    return this.chatRepository.createChat(chatRoomDto);
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  //update(id: number, updateChatDto: UpdateChatDto) {
  //  return `This action updates a #${id} chat`;
  //}

  findAllChatRoom(): Promise<ChatRoom[]> {
    return this.chatRepository.findAllChatRoom();
  }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from './chat.room.repository';
import { ChatRoomDto } from './dto/chat.room.dto';
import { ChatRoom } from './entities/chat.room.entity';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';
import { UpdateChatPasswordDto } from './dto/update.chat.password.dto';
import * as bcrypt from 'bcrypt';
import { ChatType } from './constants/chat.type.enum';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomRepository)
    private readonly chatRoomRepository: ChatRoomRepository,
  ) {}

  create(chatRoomDto: CreateChatRoomDto) {
    return this.chatRoomRepository.createChat(chatRoomDto);
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: string) {
    return `This action returns a #${id} chat`;
  }

  async updatePassword(id: string, type: ChatType, password?: string) {
    const chatRoom = await this.chatRoomRepository.findOneById(id);
    if (!chatRoom) {
      throw new ConflictException([`존재하지 않는 채팅방입니다.`]);
    }
    // 비밀번호 변경요청한 user가 해당 채팅방에 들어와있는지, 권한은 있는지 추가해야함

    return this.chatRoomRepository.updatePassword(chatRoom, password, type);
  }

  //update(id: number, updateChatDto: UpdateChatDto) {
  //  return `This action updates a #${id} chat`;
  //}

  findAllChatRoom(): Promise<ChatRoom[]> {
    return this.chatRoomRepository.findAllChatRoom();
  }
}

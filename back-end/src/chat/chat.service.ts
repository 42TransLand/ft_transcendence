import { Injectable } from '@nestjs/common';
import { ChatRoomDto } from './dto/chat.room.dto';

@Injectable()
export class ChatService {
  create(chatRoomDto: ChatRoomDto) {
    return 'This action adds a new chat';
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

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}

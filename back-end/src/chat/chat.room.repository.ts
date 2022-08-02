import { ConflictException } from '@nestjs/common';
import { CustomRepository } from 'src/custom/typeorm.decorator';
import { Equal, Repository } from 'typeorm';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';
import { UpdateChatPasswordDto } from './dto/update.chat.password.dto';
import { ChatRoom } from './entities/chat.room.entity';
import * as bcrypt from 'bcrypt';
import { ChatType } from './constants/chat.type.enum';

@CustomRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {
  async createChat(chatroomdto: CreateChatRoomDto): Promise<ChatRoom> {
    const chatRoom = this.create({
      name: chatroomdto.name,
      type: chatroomdto.type,
      password: chatroomdto.password,
    });
    await this.save(chatRoom);
    return chatRoom;
  }

  async findAllChatRoom(): Promise<ChatRoom[]> {
    return this.find();
  }

  async findOneById(id: string): Promise<ChatRoom> {
    const result = await this.findOne({
      where: {
        id: Equal(id),
      },
    });
    return result;
  }

  async updatePassword(
    chatRoom: ChatRoom,
    password: string,
    type: ChatType,
  ): Promise<ChatRoom> {
    if (password && type === 'PROTECT') {
      const salt: string = await bcrypt.genSalt();
      chatRoom.password = await bcrypt.hash(password, salt);
    } else {
      chatRoom.password = null;
      chatRoom.type = ChatType.PUBLIC;
    }
    await this.save(chatRoom);
    return chatRoom;
  }
}

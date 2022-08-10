import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomRepository } from 'src/custom/typeorm.decorator';
import { Equal, Repository } from 'typeorm';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';
import { UpdateChatPasswordDto } from './dto/update.chat.password.dto';
import { ChatRoom } from './entities/chat.room.entity';
import * as bcrypt from 'bcrypt';
import { ChatType } from './constants/chat.type.enum';

@CustomRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {
  async createChatRoom(chatroomdto: CreateChatRoomDto): Promise<ChatRoom> {
    const { name, password, type } = chatroomdto;
    let encryptPassword: string = null;

    if (password && type === 'PROTECT') {
      const salt: string = await bcrypt.genSalt();
      encryptPassword = await bcrypt.hash(password, salt);
    }
    const chatRoom = this.create({
      name,
      type,
      password: encryptPassword,
    });
    try {
      await this.save(chatRoom);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return chatRoom;
  }

  async findAllChatRoom(): Promise<ChatRoom[]> {
    return this.find();
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
    try {
      await this.save(chatRoom);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return chatRoom;
  }

  async findChatRoomById(id: string): Promise<ChatRoom> {
    const result = await this.findOne({
      where: { id },
    });
    return result;
  }

  async deleteChatRoom(id: string): Promise<void> {
    await this.delete({ id });
  }
}

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
import { ChatType, CountType } from './constants/chat.type.enum';
import { User } from 'src/users/entities/user.entity';

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
      count: 1,
      bannedUsers: [],
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
  ): Promise<void> {
    if (password && type === 'PROTECT') {
      const salt: string = await bcrypt.genSalt();
      chatRoom.password = await bcrypt.hash(password, salt);
      chatRoom.type = ChatType.PROTECT;
    } else {
      chatRoom.password = null;
      chatRoom.type = ChatType.PUBLIC;
    }
    try {
      await this.save(chatRoom);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findChatRoomById(id: string): Promise<ChatRoom> {
    const result = await this.findOne({
      where: { id },
    });
    return result;
  }

  async banChatRoom(chatRoom: ChatRoom, banUser: User): Promise<void> {
    chatRoom.bannedUsers.push(banUser.id);
    try {
      await this.save(chatRoom);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findBannedUser(id: string, user: User): Promise<boolean> {
    const chatRoom = await this.findChatRoomById(id);
    try {
      if (chatRoom.bannedUsers.includes(user.id)) {
        return true;
      }
    } catch (e) {
      // ignore
    }
    return false;
  }

  async deleteChatRoom(id: string): Promise<void> {
    await this.delete({ id });
  }

  async updateCount(chatRoom: ChatRoom, type: CountType): Promise<void> {
    if (type === 'JOIN') {
      chatRoom.count += 1;
      try {
        await this.save(chatRoom);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    } else {
      chatRoom.count -= 1;
      try {
        await this.save(chatRoom);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }
}

import { CustomRepository } from 'src/custom/typeorm.decorator';
import { User } from 'src/users/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { ChatRole } from './constants/chat.role.enum';
import { ChatRoom } from './entities/chat.room.entity';
import { ChatUser } from './entities/chat.user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@CustomRepository(ChatUser)
export class ChatUserRepository extends Repository<ChatUser> {
  async createRoomOwner(user: User, chatRoom: ChatRoom): Promise<void> {
    const chatUser = this.create({
      user,
      chatRoom,
      role: ChatRole.OWNER,
    });
    try {
      await this.save(chatUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findChatUser(user: User, chatRoom: ChatRoom): Promise<ChatUser> {
    return this.findOne({
      where: {
        user: { id: Equal(user.id) },
        chatRoom: { id: Equal(chatRoom.id) },
      },
    });
  }

  async findChatRoomById(chatRoom: ChatRoom): Promise<ChatUser[]> {
    const chatUser = await this.find({
      where: {
        chatRoom: { id: Equal(chatRoom.id) },
      },
    });
    return chatUser;
  }

  async findChatRoomUsers(id: string): Promise<ChatUser[]> {
    const chatUser = await this.find({
      where: {
        chatRoom: { id: Equal(id) },
      },
    });
    return chatUser;
  }

  async updateAdminRole(
    newAdmin: ChatUser,
    oldAdmin?: ChatUser | null,
  ): Promise<void> {
    newAdmin.role = ChatRole.ADMIN;
    if (oldAdmin !== null) {
      oldAdmin.role = ChatRole.PARTICIPANT;
      try {
        await this.save(oldAdmin);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
    try {
      await this.save(newAdmin);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateOwnerRole(user: ChatUser): Promise<void> {
    user.role = ChatRole.OWNER;
    try {
      await this.save(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findNewOwner(chatRoom: ChatRoom): Promise<ChatUser> {
    const checkAllUsers = await this.find({
      where: {
        chatRoom: { id: Equal(chatRoom.id) },
      },
      order: {
        createdAt: 'ASC',
      },
    });
    return checkAllUsers[0];
  }

  async joinChatRoom(
    user: User,
    chatRoom: ChatRoom,
    password?: string,
  ): Promise<void> {
    // 비공개방 비밀번호 검증
    let validation = false;
    if (chatRoom.type === 'PROTECT') {
      if (
        password !== undefined &&
        password !== null &&
        typeof password === 'string'
      ) {
        validation = await bcrypt.compare(password, chatRoom.password);
      }
      if (!validation) {
        throw new NotFoundException('패스워드가 올바르지 않습니다.');
      }
    }
    // 이미 채팅방에 있는 사용자인지 검사
    const alreadyUser = await this.findOne({
      where: {
        user: { id: Equal(user.id) },
      },
    });

    if (alreadyUser !== null) {
      throw new ConflictException('이미 채팅방에 접속한 유저 입니다.');
    }
    // 채팅방에 사용자 추가
    const chatUser = this.create({
      user,
      chatRoom,
      role: ChatRole.PARTICIPANT,
    });
    try {
      await this.save(chatUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async leaveChatRoom(user: User, chatRoom: ChatRoom): Promise<void> {
    await this.delete({
      user: { id: Equal(user.id) },
      chatRoom: { id: Equal(chatRoom.id) },
    });
  }
}

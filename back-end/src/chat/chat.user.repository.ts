import { CustomRepository } from 'src/custom/typeorm.decorator';
import { User } from 'src/users/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { ChatRole } from './constants/chat.role.enum';
import { ChatRoom } from './entities/chat.room.entity';
import { ChatUser } from './entities/chat.user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { type } from 'os';

@CustomRepository(ChatUser)
export class ChatUserRepository extends Repository<ChatUser> {
  async createRoomOwner(user: User, chatRoom: ChatRoom): Promise<void> {
    const chatUser = this.create({
      user,
      chatRoom,
      role: ChatRole.OWNER,
    });
    await this.save(chatUser);
  }

  async findChatUser(user: User, chatRoom: ChatRoom): Promise<ChatUser> {
    return this.findOne({
      where: {
        user: { id: Equal(user.id) },
        chatRoom: { id: Equal(chatRoom.id) },
      },
    });
  }

  async updateRole(
    newAdmin: ChatUser,
    oldAdmin?: ChatUser | null,
  ): Promise<void> {
    newAdmin.role = ChatRole.ADMIN;
    if (oldAdmin !== null) {
      oldAdmin.role = ChatRole.PARTICIPANT;
      await this.save(oldAdmin);
    }
    await this.save(newAdmin);
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
        throw new NotFoundException('Password is incorrect');
      }
    }
    // 이미 채팅방에 있는 사용자
    const alreadyUser = await this.findChatUser(user, chatRoom);
    if (alreadyUser !== null) {
      throw new NotFoundException('Already in this chat room');
    }
    // 채팅방에 사용자 추가
    const chatUser = this.create({
      user,
      chatRoom,
      role: ChatRole.PARTICIPANT,
    });
    await this.save(chatUser);
  }
}

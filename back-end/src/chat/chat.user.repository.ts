import { CustomRepository } from 'src/custom/typeorm.decorator';
import { User } from 'src/users/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { ChatRole } from './constants/chat.role.enum';
import { ChatRoom } from './entities/chat.room.entity';
import { ChatUser } from './entities/chat.user.entity';

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
    }
    await this.save(newAdmin);
    await this.save(oldAdmin);
  }
}

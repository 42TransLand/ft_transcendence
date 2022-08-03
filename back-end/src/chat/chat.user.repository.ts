import { CustomRepository } from 'src/custom/typeorm.decorator';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
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
}

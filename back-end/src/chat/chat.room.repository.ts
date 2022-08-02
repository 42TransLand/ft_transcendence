import { CustomRepository } from 'src/custom/typeorm.decorator';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat.room.entity';

@CustomRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {
  async findAllChatRoom(): Promise<ChatRoom[]> {
    return this.find();
  }
}

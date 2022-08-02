import { CustomRepository } from 'src/custom/typeorm.decorator';
import { Repository } from 'typeorm';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';
import { ChatRoom } from './entities/chat.room.entity';

@CustomRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {
  async createChat(chatroomdto: CreateChatRoomDto): Promise<string> {
    const chatRoom = this.create({
      name: chatroomdto.name,
      type: chatroomdto.type,
      password: chatroomdto.password,
    });
    await this.save(chatRoom);
    return chatRoom.id;
  }

  async findAllChatRoom(): Promise<ChatRoom[]> {
    return this.find();
  }

  async findChatRoomById(id: string): Promise<ChatRoom> {
    const result = await this.findOne({
      where: { id },
    });
    return result;
  }
}

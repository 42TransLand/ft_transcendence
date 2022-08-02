import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from './chat.room.repository';
import { ChatRoom } from './entities/chat.room.entity';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';
import { UsersService } from 'src/users/users.service';
import { ChatUserRepository } from './chat.user.repository';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomRepository)
    private readonly chatRoomRepository: ChatRoomRepository,
    @InjectRepository(ChatUserRepository)
    private readonly chatUserRepository: ChatUserRepository,
    private readonly userService: UsersService,
  ) {}

  async createChatRoom(chatRoomDto: CreateChatRoomDto): Promise<string> {
    const user = await this.userService.findByNickname(chatRoomDto.nickname);
    const room = await this.chatRoomRepository.createChatRoom(chatRoomDto);
    await this.chatUserRepository.createRoomOwner(user, room);

    return room.id;
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

  findAllChatRoom(): Promise<ChatRoom[]> {
    return this.chatRoomRepository.findAllChatRoom();
  }

  findChatRoomById(id: string): Promise<ChatRoom> {
    return this.chatRoomRepository.findChatRoomById(id);
  }
}

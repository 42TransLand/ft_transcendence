import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from './chat.room.repository';
import { ChatRoom } from './entities/chat.room.entity';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';
import { UpdateChatPasswordDto } from './dto/update.chat.password.dto';
import * as bcrypt from 'bcrypt';
import { ChatType } from './constants/chat.type.enum';
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

  findOne(id: string) {
    return `This action returns a #${id} chat`;
  }

  async updatePassword(id: string, type: ChatType, password?: string) {
    const chatRoom = await this.chatRoomRepository.findOneById(id);
    if (!chatRoom) {
      throw new ConflictException([`존재하지 않는 채팅방입니다.`]);
    }
    // 비밀번호 변경요청한 user가 해당 채팅방에 들어와있는지, 권한은 있는지 추가해야함

    return this.chatRoomRepository.updatePassword(chatRoom, password, type);
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

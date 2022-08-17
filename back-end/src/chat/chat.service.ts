import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from './chat.room.repository';
import { ChatRoom } from './entities/chat.room.entity';
import { CreateChatRoomDto } from './dto/create.chat.room.dto';
import { ChatType, CountType } from './constants/chat.type.enum';
import { UsersService } from 'src/users/users.service';
import { ChatUserRepository } from './chat.user.repository';
import { ChatRole } from './constants/chat.role.enum';
import { UpdateRoleDto } from './dto/update.role.dto';
import { ChatUser } from './entities/chat.user.entity';
import { SocketGateway } from 'src/socket/socket.gateway';
import { User } from 'src/users/entities/user.entity';
import { ChatInfoDto } from './dto/chat.info.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomRepository)
    private readonly chatRoomRepository: ChatRoomRepository,
    @InjectRepository(ChatUserRepository)
    private readonly chatUserRepository: ChatUserRepository,
    private readonly userService: UsersService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async createChatRoom(
    user: User,
    chatRoomDto: CreateChatRoomDto,
  ): Promise<string> {
    const room = await this.chatRoomRepository.createChatRoom(chatRoomDto);
    await this.chatUserRepository.createRoomOwner(user, room);
    return room.id;
  }

  async updatePassword(
    id: string,
    user: User,
    type: ChatType,
    password?: string,
  ): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const chatUser = await this.chatUserRepository.findChatUser(user, chatRoom);
    if (chatUser === null) {
      throw new BadRequestException([`채팅방에 없는 유저 입니다.`]);
    }
    if (chatUser.role !== ChatRole.OWNER) {
      throw new BadRequestException(`권한이 없습니다.`);
    }
    await this.chatRoomRepository.updatePassword(chatRoom, password, type);
  }

  async findAllChatRoom(): Promise<ChatInfoDto[]> {
    const result = await this.chatRoomRepository.findAllChatRoom();

    const rooms = result.map((findRoom) => {
      const room: ChatInfoDto = {
        id: findRoom.id,
        name: findRoom.name,
        type: findRoom.type,
        createdAt: findRoom.createdAt,
        updateAt: findRoom.updatedAt,
        count: findRoom.count,
      };
      return room;
    });
    return rooms;
  }

  async findChatRoomById(id: string): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepository.findChatRoomById(id);
    if (!chatRoom) {
      throw new NotFoundException([`존재하지 않는 채팅방입니다.`]);
    }
    return chatRoom;
  }

  async findChatRoomUsers(id: string): Promise<ChatUser[]> {
    return this.chatUserRepository.findChatRoomUsers(id);
  }

  async updateRole(
    id: string,
    user: User,
    updateRoleDto: UpdateRoleDto,
  ): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    let oldAdmin = null;
    const owner = await this.chatUserRepository.findChatUser(user, chatRoom);
    if (owner.role !== ChatRole.OWNER) {
      throw new UnauthorizedException(`권한이 없습니다.`);
    }
    // oldAdmin 확실하게 들어온다고 가정하고 진행, 없으면 null, 있으면 객체
    if (updateRoleDto.oldAdmin) {
      user = await this.userService.findByNickname(updateRoleDto.oldAdmin);
      oldAdmin = await this.chatUserRepository.findChatUser(user, chatRoom);
    }

    user = await this.userService.findByNickname(updateRoleDto.newAdmin);
    const newAdmin = await this.chatUserRepository.findChatUser(user, chatRoom);
    if (newAdmin.role === ChatRole.ADMIN) {
      throw new ConflictException(`이미 해당 유저는 admin입니다.`);
    }

    this.chatUserRepository.updateAdminRole(newAdmin, oldAdmin);
  }

  async joinChatRoom(id: string, user: User, password: string): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    if (chatRoom.type === ChatType.PROTECT && password !== undefined) {
      this.chatUserRepository.joinChatRoom(user, chatRoom, password);
      return this.chatRoomRepository.updateCount(chatRoom, CountType.JOIN);
    }
    this.chatUserRepository.joinChatRoom(user, chatRoom);
    return this.chatRoomRepository.updateCount(chatRoom, CountType.JOIN);
  }

  async leaveChatRoom(id: string, user: User): Promise<string> {
    const chatRoom = await this.findChatRoomById(id);
    const findChatUser = await this.chatUserRepository.findChatUser(
      user,
      chatRoom,
    );
    if (!findChatUser) {
      throw new NotFoundException([`채팅방에 없는 유저입니다.`]);
    }
    await this.chatUserRepository.leaveChatRoom(user, chatRoom);
    const chatUsers = await this.chatUserRepository.findChatRoomById(chatRoom);
    if (chatUsers.length === 0) {
      // 채팅방에 유저가 없으면 삭제
      await this.chatRoomRepository.deleteChatRoom(chatRoom.id);
      return `${chatRoom.id} 채팅방이 삭제되었습니다.`;
    }
    // 나간 사람이 Owner여서 새로운 오너가 정해져야 하는 경우
    if (findChatUser.role === ChatRole.OWNER) {
      const newOwner = await this.chatUserRepository.findNewOwner(chatRoom);
      await this.chatUserRepository.updateOwnerRole(newOwner);
      return `${newOwner.id}님이 채팅방 오너로 설정되었습니다.`; // 지금은 db의 PK값 반환
    }
    this.chatRoomRepository.updateCount(chatRoom, CountType.LEAVE);
    return `${user.nickname}님이 채팅방에서 나가셨습니다.`;
  }

  async kickChatUser(id: string, user: User, nickname: string): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const findChatUser = await this.chatUserRepository.findChatUser(
      user,
      chatRoom,
    );
    if (!findChatUser) {
      throw new NotFoundException([`채팅방에 없는 유저입니다.`]);
    }
    if (findChatUser.role !== ChatRole.OWNER) {
      throw new UnauthorizedException(`권한이 없습니다.`);
    }
    const kickUser = await this.userService.findByNickname(nickname);
    await this.chatUserRepository.leaveChatRoom(kickUser, chatRoom);
    await this.chatRoomRepository.updateCount(chatRoom, CountType.LEAVE);
  }

  async sendChat(id: string, user: User, content: string): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);

    const chatUser = await this.chatUserRepository.findChatUser(user, chatRoom);
    if (chatUser === null) {
      throw new NotFoundException([`채팅방에 없는 유저입니다.`]);
    }

    if (chatUser.unmutedAt) {
      const now: Date = new Date();
      const diff = chatUser.unmutedAt.getTime() - now.getTime();
      if (diff > 0) {
        throw new BadRequestException([
          `${Math.floor(diff / 1000)}초 후에 채팅을 사용할 수 있습니다.`,
        ]);
      }
    }

    this.socketGateway.server.to(id).emit(
      'chat',
      JSON.stringify({
        nickname: user.nickname,
        content,
      }),
    );
  }

  async updateChatMute(
    id: string,
    user: User,
    nickname: string,
  ): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);

    const myChatUser = await this.chatUserRepository.findChatUser(
      user,
      chatRoom,
    );
    if (myChatUser === null) {
      throw new NotFoundException([
        `본인은 채팅방에 접속하지 않은 유저입니다.`,
      ]);
    }
    const opponent = await this.userService.findByNickname(nickname);
    const chatUser = await this.chatUserRepository.findChatUser(
      opponent,
      chatRoom,
    );
    if (chatUser === null) {
      throw new NotFoundException([
        `상대방은 채팅방에 접속하지 않은 유저입니다.`,
      ]);
    }

    if (
      !(
        (myChatUser.role === ChatRole.OWNER ||
          myChatUser.role === ChatRole.ADMIN) &&
        chatUser.role !== ChatRole.OWNER &&
        chatUser.role !== ChatRole.ADMIN
      )
    ) {
      throw new BadRequestException(`해당 유저에게 mute를 할 수 없습니다.`);
    }

    const muteMinutes = 1;
    const muteTime: Date = new Date();
    muteTime.setMinutes(muteTime.getMinutes() + muteMinutes);

    chatUser.unmutedAt = muteTime;
    try {
      await this.chatUserRepository.save(chatUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    setTimeout(async () => {
      chatUser.unmutedAt = null;
      await this.chatUserRepository.save(chatUser);
    }, muteMinutes * 60 * 1000);
  }

  async updateChatUnMute(
    id: string,
    user: User,
    nickname: string,
  ): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);

    const myChatUser = await this.chatUserRepository.findChatUser(
      user,
      chatRoom,
    );
    if (myChatUser === null) {
      throw new NotFoundException([
        `본인은 채팅방에 접속하지 않은 유저입니다.`,
      ]);
    }
    const opponent = await this.userService.findByNickname(nickname);
    const chatUser = await this.chatUserRepository.findChatUser(
      opponent,
      chatRoom,
    );
    if (chatUser === null) {
      throw new NotFoundException([
        `상대방은 채팅방에 접속하지 않은 유저입니다.`,
      ]);
    }

    if (
      !(
        (myChatUser.role === ChatRole.OWNER ||
          myChatUser.role === ChatRole.ADMIN) &&
        chatUser.role !== ChatRole.OWNER &&
        chatUser.role !== ChatRole.ADMIN
      )
    ) {
      throw new BadRequestException(`해당 유저에게 unMute를 할 수 없습니다.`);
    }

    chatUser.unmutedAt = null;
    try {
      await this.chatUserRepository.save(chatUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
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
import { ChatUser } from './entities/chat.user.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatInfoDto } from './dto/chat.info.dto';
import { ChatUserUpdateType } from 'src/socket/chat/constants/chat.user.update.type.enum';
import { SocketService } from 'src/socket/socket.service';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomRepository)
    private readonly chatRoomRepository: ChatRoomRepository,
    @InjectRepository(ChatUserRepository)
    private readonly chatUserRepository: ChatUserRepository,
    private readonly userService: UsersService,

    @Inject(forwardRef(() => SocketGateway))
    private readonly socketGateway: SocketGateway,

    @Inject(forwardRef(() => SocketService))
    private readonly socketService: SocketService,
  ) {}

  async createChatRoom(
    user: User,
    chatRoomDto: CreateChatRoomDto,
  ): Promise<string> {
    const room = await this.chatRoomRepository.createChatRoom(chatRoomDto);
    this.chatUserRepository.createRoomOwner(user, room);
    this.socketService.handleJoinChatRoom(room.id, user.id);
    return room.id;
  }

  async updatePassword(
    id: string,
    user: User,
    type: ChatType,
    password?: string,
  ): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const chatUser = await this.findChatUser(user, chatRoom);
    if (chatUser.role !== ChatRole.OWNER) {
      throw new BadRequestException(`권한이 없습니다.`);
    }
    if (type === ChatType.PROTECT && password) {
      this.socketService.handleUpdateChatType(
        this.socketGateway.server,
        chatRoom.id,
        false,
      );
    } else {
      this.socketService.handleUpdateChatType(
        this.socketGateway.server,
        chatRoom.id,
        true,
      );
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

  async findChatUser(user: User, chatRoom: ChatRoom): Promise<ChatUser> {
    const chatUser = await this.chatUserRepository.findChatUser(user, chatRoom);
    if (!chatUser) {
      throw new NotFoundException([`채팅방에 없는 유저 입니다.`]);
    }
    return chatUser;
  }

  async updateRole(id: string, user: User, nickname: string): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const owner = await this.findChatUser(user, chatRoom);

    if (owner.role !== ChatRole.OWNER) {
      throw new UnauthorizedException(`권한이 없습니다.`);
    }

    const findUser = await this.userService.findByNickname(nickname);
    const newAdmin = await this.findChatUser(findUser, chatRoom);
    if (newAdmin.role === ChatRole.ADMIN) {
      throw new ConflictException(`이미 관리자입니다.`);
    }

    const deleteUser = await this.chatUserRepository.updateAdminRole(
      newAdmin,
      chatRoom,
    );
    if (deleteUser !== null) {
      this.socketService.handleUpdateChatUser(
        this.socketGateway.server,
        id,
        deleteUser.user.id,
        deleteUser.user.nickname,
        ChatUserUpdateType.ADMIN,
        false,
      );
    }
    this.socketService.handleUpdateChatUser(
      this.socketGateway.server,
      id,
      findUser.id,
      nickname,
      ChatUserUpdateType.ADMIN,
      true,
    );
  }

  async deleteRole(id: string, user: User, nickname: string): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const owner = await this.findChatUser(user, chatRoom);

    if (owner.role !== ChatRole.OWNER) {
      throw new UnauthorizedException(`권한이 없습니다.`);
    }

    const findUser = await this.userService.findByNickname(nickname);
    const oldAdmin = await this.findChatUser(findUser, chatRoom);
    if (oldAdmin.role !== ChatRole.ADMIN) {
      throw new BadRequestException(`해당 유저는 관리자가 아닙니다.`);
    }
    await this.chatUserRepository.deleteAdminRole(chatRoom);
    this.socketService.handleUpdateChatUser(
      this.socketGateway.server,
      id,
      findUser.id,
      nickname,
      ChatUserUpdateType.ADMIN,
      false,
    );
  }

  async joinChatRoom(id: string, user: User, password: string): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const isBannedUser = await this.chatRoomRepository.findBannedUser(id, user);
    if (isBannedUser) {
      throw new BadRequestException(`영구 추방된 유저입니다.`);
    }
    if (chatRoom.type === ChatType.PROTECT && password !== undefined) {
      await this.chatUserRepository.joinChatRoom(user, chatRoom, password);
    } else {
      await this.chatUserRepository.joinChatRoom(user, chatRoom);
    }
    await this.chatRoomRepository.updateCount(chatRoom, CountType.JOIN);
    this.socketService.handleJoinChatRoom(chatRoom.id, user.id);
  }

  async leaveChatRoom(id: string, user: User): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const findChatUser = await this.findChatUser(user, chatRoom);

    await this.chatUserRepository.leaveChatRoom(user, chatRoom);
    this.socketService.handleLeaveChatRoom(user.id, ChatUserUpdateType.LEAVE);
    const chatUsers = await this.chatUserRepository.findChatRoomById(chatRoom);
    if (chatUsers.length === 0) {
      // 채팅방에 유저가 없으면 삭제
      await this.chatRoomRepository.deleteChatRoom(chatRoom.id);
      return;
    }
    await this.chatRoomRepository.updateCount(chatRoom, CountType.LEAVE);
    // 나간 사람이 Owner여서 새로운 오너가 정해져야 하는 경우
    if (findChatUser.role === ChatRole.OWNER) {
      const newOwner = await this.chatUserRepository.findNewOwner(chatRoom);
      const newOwnerUser = await this.chatUserRepository.findChatUserNickname(
        newOwner,
      );

      await this.chatUserRepository.updateOwnerRole(newOwner);
      this.socketService.handleUpdateChatUser(
        this.socketGateway.server,
        id,
        newOwnerUser.id,
        newOwnerUser.nickname,
        ChatUserUpdateType.OWNER,
        true,
      );
    }
  }

  async kickChatUser(id: string, user: User, nickname: string): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const findChatUser = await this.findChatUser(user, chatRoom);

    if (findChatUser.role !== ChatRole.OWNER) {
      throw new UnauthorizedException(`권한이 없습니다.`);
    }
    if (user.nickname === nickname) {
      throw new ConflictException(`자기 자신을 추방할 수 없습니다.`);
    }
    const kickUser = await this.userService.findByNickname(nickname);
    await this.chatUserRepository.leaveChatRoom(kickUser, chatRoom);
    await this.chatRoomRepository.updateCount(chatRoom, CountType.LEAVE);
    this.socketService.handleLeaveChatRoom(
      kickUser.id,
      ChatUserUpdateType.KICK,
    );
  }

  async banChatUser(id: string, user: User, nickname: string): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const findChatUser = await this.findChatUser(user, chatRoom);
    const banUser = await this.userService.findByNickname(nickname);

    if (findChatUser.role !== ChatRole.OWNER) {
      throw new UnauthorizedException(`권한이 없습니다.`);
    }
    if (user.nickname === nickname) {
      throw new ConflictException(`자기 자신을 추방할 수 없습니다.`);
    }
    if (await this.chatRoomRepository.findBannedUser(id, banUser)) {
      throw new ConflictException(`이미 추방된 유저입니다.`);
    }
    await this.chatUserRepository.leaveChatRoom(banUser, chatRoom);
    await this.chatRoomRepository.banChatRoom(chatRoom, banUser);
    await this.chatRoomRepository.updateCount(chatRoom, CountType.LEAVE);
    this.socketService.handleLeaveChatRoom(banUser.id, ChatUserUpdateType.BAN);
  }

  async sendChat(id: string, user: User, content: string): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const chatUser = await this.findChatUser(user, chatRoom);

    if (chatUser.unmutedAt) {
      const now: Date = new Date();
      const diff = chatUser.unmutedAt.getTime() - now.getTime();
      if (diff > 0) {
        throw new BadRequestException([
          `${Math.floor(diff / 1000)}초 후에 채팅을 사용할 수 있습니다.`,
        ]);
      }
    }
    this.socketService.handleChatMessage(
      this.socketGateway.server,
      user.nickname,
      chatRoom.id,
      content,
    );
  }

  async updateChatMute(
    id: string,
    user: User,
    nickname: string,
  ): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);
    const myChatUser = await this.findChatUser(user, chatRoom);

    if (user.nickname === nickname) {
      throw new ConflictException(`자기 자신을 음소거 할 수 없습니다.`);
    }
    const opponent = await this.userService.findByNickname(nickname);
    const chatUser = await this.findChatUser(opponent, chatRoom);

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
      this.socketService.handleUpdateChatUser(
        this.socketGateway.server,
        id,
        opponent.id,
        nickname,
        ChatUserUpdateType.MUTE,
        false,
      );
    }, muteMinutes * 60 * 1000);

    this.socketService.handleUpdateChatUser(
      this.socketGateway.server,
      id,
      opponent.id,
      nickname,
      ChatUserUpdateType.MUTE,
      true,
    );
  }

  async updateChatUnMute(
    id: string,
    user: User,
    nickname: string,
  ): Promise<void> {
    const chatRoom = await this.findChatRoomById(id);

    const myChatUser = await this.findChatUser(user, chatRoom);
    const opponent = await this.userService.findByNickname(nickname);
    const chatUser = await this.findChatUser(opponent, chatRoom);

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
    if (chatUser.unmutedAt === null) {
      throw new BadRequestException(
        `음소거 하지 않은 유저에게 음소개 해제를 할 수 없습니다.`,
      );
    }
    chatUser.unmutedAt = null;
    try {
      await this.chatUserRepository.save(chatUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    this.socketService.handleUpdateChatUser(
      this.socketGateway.server,
      id,
      opponent.id,
      nickname,
      ChatUserUpdateType.MUTE,
      false,
    );
  }
}

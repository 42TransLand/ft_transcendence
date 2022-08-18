import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FriendRepository } from './friend.repository';
import { AlertService } from 'src/alert/alert.service';
import { User } from 'src/users/entities/user.entity';
import { Friend } from './entities/friend.entity';
import { FriendStatus } from './constants/friend.enum';
import { FriendListDto } from './dto/friend.list.dto';
import { SocketStateService } from 'src/socket/socket-state.service';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendRepository)
    private friendRepository: FriendRepository,
    private userService: UsersService,
    private alertService: AlertService,
    private readonly socketStateService: SocketStateService,
  ) {}

  async findAllFriends(user: User): Promise<FriendListDto[]> {
    return this.friendRepository.findAllFriends(user);
  }

  async requestFriend(user: User, nickname: string): Promise<void> {
    if (user.nickname === nickname) {
      throw new BadRequestException(
        '자기 자신에게 친구 요청을 보낼 수 없습니다.',
      );
    }
    const opponentUser = await this.userService.findByNickname(nickname);
    await this.friendRepository.requestFriend(user, opponentUser);
    await this.alertService.createAlert(user, opponentUser);
  }

  async acceptFriend(
    user: User,
    alertId: string,
    userId: string,
  ): Promise<void> {
    const opponentUser = await this.userService.findById(userId);
    await this.alertService.updateAlert(alertId);
    await this.friendRepository.acceptFriend(opponentUser, user);
    const friends = await this.findAllFriends(user);
    await this.socketStateService.retrieveState(
      user.id,
      friends.map((f) => f.id),
    );
    this.socketStateService.notifyOneByUserId(user.id, userId);
  }

  async rejectFriend(
    user: User,
    alertId: string,
    userId: string,
  ): Promise<void> {
    const opponentUser = await this.userService.findById(userId);
    await this.alertService.updateAlert(alertId); // [추가된 항목]
    await this.friendRepository.rejectFriend(opponentUser, user);
  }

  async blockFriend(user: User, nickname: string): Promise<void> {
    const opponentUser = await this.userService.findByNickname(nickname);
    await this.friendRepository.blockFriend(user, opponentUser);
  }

  async unblockFriend(user: User, nickname: string): Promise<void> {
    const opponentUser = await this.userService.findByNickname(nickname);
    await this.friendRepository.unblockFriend(user, opponentUser);
  }

  // 받는 사람이 차단했는지 확일 할 때
  async getFriend(sender: User, receiver: User): Promise<Friend> {
    const friendShip = await this.friendRepository.findRow(receiver, sender);
    if (!friendShip || friendShip.status === FriendStatus.PENDDING) {
      throw new NotFoundException('아무 관계가 아니다.');
    }
    return friendShip;
  }
}

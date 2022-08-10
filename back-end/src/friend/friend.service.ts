import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FriendDto } from './dto/friend.dto';
import { FriendRepository } from './friend.repository';
import { AlertService } from 'src/alert/alert.service';
import { AlertDto } from 'src/alert/dto/alert.dto';
import { FriendAlertDto } from './dto/friendAlert.dto';
import { User } from 'src/users/entities/user.entity';
import { Friend } from './entities/friend.entity';
import { DeleteResult, Not } from 'typeorm';
import { FriendStatus } from './constants/friend.enum';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendRepository)
    private friendRepository: FriendRepository,
    private userService: UsersService,
    private alertService: AlertService,
  ) {}

  async findAllFriends(user: User): Promise<Friend[]> {
    return this.friendRepository.findAllFriends(user);
  }

  async searchFriend(user: User, nickname: string): Promise<Friend[]> {
    const opponentUser = await this.userService.findByNickname(nickname);
    return this.friendRepository.searchFriend(user, opponentUser);
  }

  async requestFriend(user: User, nickname: string): Promise<Friend> {
    // [Todo] re
    const opponentUser = await this.userService.findByNickname(nickname);

    return this.friendRepository.requestFriend(user, opponentUser);
    // const alertDto: AlertDto = { user, opponentUser, read: false };
    // return this.alertService.createAlert(alertDto);
  }

  async acceptFriend(user: User, nickname: string): Promise<Friend> {
    const opponentUser = await this.userService.findByNickname(nickname);
    //await this.alertService.updateAlert(alertId); // [추가된 항목]
    return this.friendRepository.acceptFriend(opponentUser, user);
  }

  async rejectFriend(user: User, nickname: string): Promise<DeleteResult> {
    const opponentUser = await this.userService.findByNickname(nickname);
    //const { requestor, receiver, alertId } = friendAlertDto;
    //await this.alertService.updateAlert(alertId); // [추가된 항목]
    return this.friendRepository.rejectFriend(opponentUser, user);
  }

  async blockFriend(user: User, nickname: string): Promise<Friend> {
    const opponentUser = await this.userService.findByNickname(nickname);
    return this.friendRepository.blockFriend(user, opponentUser);
  }

  // 받는 사람이 차단했는지 확일 할 때
  async getFriend(sender: User, receiver: User): Promise<Friend> {
    const friendShip = await this.friendRepository.findRow(receiver, sender);
    if (!friendShip) {
      throw new NotFoundException('아무 관계가 아니다.');
    }
    return friendShip;
  }
}

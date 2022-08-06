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
import { Not } from 'typeorm';
import { FriendStatus } from './constants/friend.enum';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendRepository)
    private friendRepository: FriendRepository,
    private userService: UsersService,
    private alertService: AlertService,
  ) {}

  async requestFriend(friendDto: FriendDto): Promise<void> {
    const { requestor, receiver } = friendDto;

    // [Todo] re
    const reqUser = await this.userService.findByNickname(requestor);
    const resUser = await this.userService.findByNickname(receiver);
    await this.friendRepository.requestFriend(reqUser, resUser);
    const alertDto: AlertDto = { requestor, receiver, read: false };
    return this.alertService.createAlert(alertDto);
  }

  async acceptFriend(friendAlertDto: FriendAlertDto): Promise<void> {
    const { requestor, receiver, alertId } = friendAlertDto;

    const reqUser = await this.userService.findByNickname(receiver);
    const resUser = await this.userService.findByNickname(requestor);
    await this.alertService.updateAlert(alertId); // [추가된 항목]

    return this.friendRepository.acceptFriend(reqUser, resUser);
  }

  async rejectFriend(friendAlertDto: FriendAlertDto): Promise<void> {
    const { requestor, receiver, alertId } = friendAlertDto;

    const reqUser = await this.userService.findByNickname(receiver);
    const resUser = await this.userService.findByNickname(requestor);
    await this.alertService.updateAlert(alertId); // [추가된 항목]
    return this.friendRepository.rejectFriend(reqUser, resUser);
  }

  async blockFriend(friendDto: FriendDto): Promise<void> {
    const { requestor, receiver } = friendDto;

    const reqUser = await this.userService.findByNickname(requestor);
    const resUser = await this.userService.findByNickname(receiver);
    return this.friendRepository.blockFriend(reqUser, resUser);
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

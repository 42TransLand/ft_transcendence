import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FriendDto } from './dto/friend.dto';
import { FriendRepository } from './friend.repository';
import { AlertService } from 'src/alert/alert.service';
import { AlertDto } from 'src/alert/dto/alert.dto';
import { FriendAlertDto } from './dto/friendAlert.dto';

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
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FriendDto } from './dto/friend.dto';
import { FriendRepository } from './friend.repository';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendRepository)
    private FriendRepository: FriendRepository,
    private userService: UsersService,
  ) {}

  async requestFriend(friendDto: FriendDto): Promise<void> {
    const { requestor, receiver } = friendDto;

    // [Todo] re
    const reqUser = await this.userService.findByNickname(requestor);
    const resUser = await this.userService.findByNickname(receiver);
    return this.FriendRepository.requestFriend(reqUser, resUser);
  }

  async acceptFriend(friendDto: FriendDto): Promise<void> {
    const { requestor, receiver } = friendDto;

    const reqUser = await this.userService.findByNickname(receiver);
    const resUser = await this.userService.findByNickname(requestor);

    return this.FriendRepository.acceptFriend(reqUser, resUser);
  }

  async rejectFriend(friendDto: FriendDto): Promise<void> {
    const { requestor, receiver } = friendDto;

    const reqUser = await this.userService.findByNickname(receiver);
    const resUser = await this.userService.findByNickname(requestor);
    return this.FriendRepository.rejectFriend(reqUser, resUser);
  }

  async blockFriend(friendDto: FriendDto): Promise<void> {
    const { requestor, receiver } = friendDto;

    const reqUser = await this.userService.findByNickname(requestor);
    const resUser = await this.userService.findByNickname(receiver);
    return this.FriendRepository.blockFriend(reqUser, resUser);
  }
}

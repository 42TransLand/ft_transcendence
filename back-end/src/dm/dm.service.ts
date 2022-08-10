import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendService } from 'src/friend/friend.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DMRepository } from './dm.repository';
import { DmDto } from './dto/dm.dto';
import { Dm } from './entities/dm.entity';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DMRepository)
    private readonly dmRepository: DMRepository,
    private readonly userService: UsersService,
    private readonly friendService: FriendService,
    private readonly socketGateway: SocketGateway,
  ) {}

  // 아직 미완성
  async getDMsByUser(user: User, nickname: string): Promise<DmDto[]> {
    const oppositeUser = await this.userService.findByNickname(nickname);
    return this.dmRepository.getDMsByOpposite(user, oppositeUser);
  }

  async createDM(
    sender: string,
    receiver: string,
    content: string,
  ): Promise<Dm> {
    const senderUser = await this.userService.findByNickname(sender);
    const receiverUser = await this.userService.findByNickname(receiver);

    const friendShip = await this.friendService.getFriend(
      senderUser,
      receiverUser,
    );
    if (friendShip.block === true) {
      throw new NotFoundException('차단된 사용자입니다.');
    }
    const dm = await this.dmRepository.createDM(
      senderUser,
      receiverUser,
      content,
    );
    this.socketGateway.server
      .to(receiverUser.id)
      .emit('dm', JSON.stringify({ nickname: sender, content }));
    this.socketGateway.server
      .to(senderUser.id)
      .emit('dm', JSON.stringify({ nickname: sender, content }));
    return dm;
  }
}

import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { CustomRepository } from '../custom/typeorm.decorator';
import { Friend } from './entities/friend.entity';
import { FriendStatus } from './constants/friend.enum';

@CustomRepository(Friend)
export class FriendRepository extends Repository<Friend> {
  async requestFriend(requestor: User, receiver: User): Promise<void> {
    // 친구 요청을 했는데, 상대방이 이 친구를 차단했다면 요청 자체가 안가도록.
    const resultOp = await this.findRow(receiver, requestor);
    if (resultOp !== null && resultOp.block === true) {
      throw new BadRequestException([`상대방이 차단, 요청 불가`]);
    }

    const result: Friend = await this.findRow(requestor, receiver);
    if (result !== null) {
      if (result.block === true) {
        throw new BadRequestException([
          `차단한 유저에게 친구요청을 보내셨습니다.`,
        ]);
      }
      if (result.status === FriendStatus.FRIEND) {
        throw new BadRequestException([`이미 친구입니다.`]);
      } else if (result.status === FriendStatus.PENDDING) {
        throw new ConflictException([`이미 친구 요청 보냈습니다.`]);
      }
    }
    const friend = this.create({
      requestor,
      receiver,
      status: FriendStatus.PENDDING,
    });
    try {
      await this.save(friend);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async acceptFriend(requestor: User, receiver: User): Promise<void> {
    // friend DB에 관계가 있는지 확인
    // PENDDING -> FRIEND (Update)
    // accept 무조건 1번만 들어온다고 가정. (재요청 불가)
    // 친구 요청자가 requestor
    // console.log(requestor.id);
    // console.log(4);
    // console.log(receiver.id);
    const foundUpdate: Friend = await this.findRow(requestor, receiver);
    const foundCreate: Friend = await this.findRow(receiver, requestor);

    if (foundUpdate.status !== FriendStatus.PENDDING) {
      throw new BadRequestException([`요청이 오지 않았다.`]);
    }
    if (foundCreate !== null && foundCreate.block === true) {
      throw new BadRequestException([
        `차단한 유저의 친구요청을 수락하셨습니다.`,
      ]);
    }
    foundUpdate.status = FriendStatus.FRIEND;
    try {
      await this.save(foundUpdate);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    const friend = this.create({
      requestor: receiver,
      receiver: requestor,
      status: FriendStatus.FRIEND,
      block: false,
    });
    try {
      await this.save(friend);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async rejectFriend(requestor: User, receiver: User): Promise<void> {
    const result = await this.delete({
      requestor: { id: Equal(requestor.id) },
      receiver: { id: Equal(receiver.id) },
      status: FriendStatus.PENDDING,
    });
    if (result.affected === 0) {
      throw new BadRequestException([`친구 요청이 오지 않았습니다.`]);
    }
  }

  // 모든 유저를 차단할 수 있다.
  async blockFriend(requestor: User, receiver: User): Promise<void> {
    const result: Friend = await this.findRow(requestor, receiver);

    // 이미 차단된 상태가 아니면 block true로 차단시킨다.
    if (result !== null) {
      if (result.block === true) {
        throw new BadRequestException([`이미 차단한 유저 입니다.`]);
      }
      result.block = true;
      try {
        await this.save(result);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }

    // 관계가 없던 상태라 block으로 만들어서 저장
    const friend = this.create({
      requestor,
      receiver,
      status: FriendStatus.NONE,
      block: true,
    });
    try {
      await this.save(friend);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findRow(requestor: User, receiver: User): Promise<Friend> {
    const result = await this.findOne({
      relations: {
        requestor: true,
        receiver: true,
      },
      where: {
        requestor: { id: Equal(requestor.id) },
        receiver: { id: Equal(receiver.id) },
      },
    });
    return result;
  }

  async findAllFriends(user: User): Promise<User[]> {
    /* 친구인 경우, 자기 자신이 requestor 혹은 receiver 둘 중 하나에는 무조건 있기 때문에
       requestor가 자기 자신인 경우를 찾아 반환한다.*/
    const result = await this.find({
      relations: {
        requestor: true,
        receiver: true,
      },
      where: {
        requestor: { id: Equal(user.id) },
        status: FriendStatus.FRIEND,
      },
    });
    const friends = result.map((friend) => {
      if (friend.requestor.id === user.id) {
        return friend.receiver;
      }
    });
    return friends;
  }
}

import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { CustomRepository } from '../custom/typeorm.decorator';
import { FriendDto } from './dto/friend.dto';
import { Friend } from './entities/friend.entity';
import { FriendStatus } from './friend.enum';

@CustomRepository(Friend)
export class FriendRepository extends Repository<Friend> {
  async requestFriend(requestor: User, receiver: User): Promise<void> {
    // 친구 요청을 했는데, 상대방이 이 친구를 차단했다면 요청 자체가 안가도록.
    const resultOp = await this.findRow(receiver, requestor);
    if (resultOp !== null && resultOp.block === true) {
      throw new ConflictException([`상대방이 차단, 요청 불가`]);
    }

    const result: Friend = await this.findRow(requestor, receiver);
    if (result !== null) {
      // 예외처리 변경하기
      if (result.block === true) {
        throw new ConflictException([
          `차단한 유저에게 친구요청을 보내셨습니다.`,
        ]);
      }
      if (result.status === FriendStatus.FRIEND) {
        throw new NotFoundException([`이미 친구다.`]);
      } else if (result.status === FriendStatus.PENDDING) {
        throw new NotFoundException([`이미 친구 요청 보냈다.`]);
      }
    }
    const friend = this.create({
      requestor,
      receiver,
      status: FriendStatus.PENDDING,
    });
    await this.save(friend);
  }

  async acceptFriend(requestor: User, receiver: User): Promise<void> {
    // friend DB에 관계가 있는지 확인
    // PENDDING -> FRIEND (Update)
    // accept 무조건 1번만 들어온다고 가정. (재요청 불가)
    // 친구 요청자가 requestor
    const foundUpdate: Friend = await this.findRow(requestor, receiver);
    const foundCreate: Friend = await this.findRow(receiver, requestor);

    if (foundUpdate.status !== FriendStatus.PENDDING) {
      // 에러 핸들링은 나중에 적절하게 MDN보고 바꾸기
      throw new ConflictException([`요청이 오지 않았다.`]);
    }
    if (foundCreate !== null && foundCreate.block === true) {
      throw new ConflictException([`차단한 유저의 친구요청을 수락하셨습니다.`]);
    }

    foundUpdate.status = FriendStatus.FRIEND;
    await this.save(foundUpdate);

    const friend = this.create({
      requestor: receiver,
      receiver: requestor,
      status: FriendStatus.FRIEND,
      block: false,
    });
    await this.save(friend);
  }

  async rejectFriend(requestor: User, receiver: User): Promise<void> {
    const result = await this.delete({
      requestor: { id: Equal(requestor.id) },
      receiver: { id: Equal(receiver.id) },
      status: FriendStatus.PENDDING,
    });
    if (result.affected === 0) {
      throw new NotFoundException([
        `Friend with ${requestor.nickname} which status is ${FriendStatus.PENDDING} not found.`,
      ]);
    }
  }

  // 모든 유저를 차단할 수 있다.
  async blockFriend(requestor: User, receiver: User): Promise<void> {
    const result: Friend = await this.findRow(requestor, receiver);

    // 이미 차단된 상태가 아니면 block true로 차단시킨다.
    if (result !== null) {
      if (result.block === true) {
        throw new NotFoundException([`이미 차단한 유저 입니다.`]);
      }
      result.block = true;
      await this.save(result);
      return;
    }

    // 관계가 없던 상태라 block으로 만들어서 저장
    const friend = this.create({
      requestor,
      receiver,
      status: FriendStatus.NONE,
      block: true,
    });
    await this.save(friend);
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
}

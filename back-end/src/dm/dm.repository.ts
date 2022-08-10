import { InternalServerErrorException } from '@nestjs/common';
import { CustomRepository } from 'src/custom/typeorm.decorator';
import { User } from 'src/users/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { DmDto } from './dto/dm.dto';
import { Dm } from './entities/dm.entity';

@CustomRepository(Dm)
export class DMRepository extends Repository<Dm> {
  async createDM(sender: User, receiver: User, content: string): Promise<Dm> {
    const DM = await this.create({
      sender,
      receiver,
      content,
    });
    try {
      await this.save(DM);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return DM;
  }

  async getDMsByOpposite(myUser: User, oppositeUser: User): Promise<DmDto[]> {
    const result = await this.find({
      relations: {
        sender: true,
        receiver: true,
      },
      where: [
        {
          sender: { id: Equal(myUser.id) },
          receiver: { id: Equal(oppositeUser.id) },
        },
        {
          sender: { id: Equal(oppositeUser.id) },
          receiver: { id: Equal(myUser.id) },
        },
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    const dms = result.map((findDM) => {
      const dm: DmDto = {
        dmId: findDM.id,
        content: findDM.content,
        senderId: findDM.sender.id,
        senderNickName: findDM.sender.nickname,
        receiverId: findDM.receiver.id,
        receiverNickName: findDM.receiver.nickname,
        createdAt: findDM.createdAt,
      };
      return dm;
    });
    return dms;
  }
}

import { CustomRepository } from 'src/custom/typeorm.decorator';
import { User } from 'src/users/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { Dm } from './entities/dm.entity';

@CustomRepository(Dm)
export class DMRepository extends Repository<Dm> {
  async createDM(sender: User, receiver: User, content: string): Promise<Dm> {
    const DM = await this.create({
      sender,
      receiver,
      content,
    });
    await this.save(DM);
    return DM;
  }

  async getDMsByOpposite(myUser: User, oppositeUser: User): Promise<Dm[]> {
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
    return result;
  }
}

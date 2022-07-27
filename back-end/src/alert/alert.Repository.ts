import { CustomRepository } from 'src/custom/typeorm.decorator';
import { User } from 'src/users/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { AlertDto } from './dto/alert.dto';
import { Alert } from './entities/alert.entity';

@CustomRepository(Alert)
export class AlertRepository extends Repository<Alert> {
  async createAlert(requestor: User, receiver: User): Promise<void> {
    const alert = this.create({
      requestor,
      receiver,
      read: false,
    });
    await this.save(alert);
  }

  async findOneById(id: string): Promise<Alert> {
    const result = await this.findOne({
      relations: {
        requestor: true,
        receiver: true,
      },
      where: {
        id: Equal(id),
      },
    });
    return result;
  }
}

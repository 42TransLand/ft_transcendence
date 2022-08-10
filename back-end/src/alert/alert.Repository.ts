import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      await this.save(alert);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    console.log(alert.id);
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

  async updateAlert(id: string): Promise<Alert> {
    const alertId = await this.findOneById(id);
    alertId.read = true;
    try {
      await this.save(alertId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return alertId;
  }

  async findAll(user: User): Promise<Alert[]> {
    const result = await this.find({
      relations: {
        requestor: true,
        receiver: true,
      },
      where: {
        receiver: { id: Equal(user.id) },
        read: false,
      },
    });
    return result;
  }
}

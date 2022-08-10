import { Injectable } from '@nestjs/common';
import { AlertDto } from './dto/alert.dto';
import { Alert } from './entities/alert.entity';
import { AlertRepository } from './alert.Repository';
import { UserRepository } from 'src/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(AlertRepository)
    private alertRepository: AlertRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createAlert(user: User, opponentUser: User): Promise<void> {
    await this.alertRepository.createAlert(user, opponentUser);
  }

  async findAll(user: User): Promise<AlertDto[]> {
    return this.alertRepository.findAll(user);
  }

  async findOneById(id: string): Promise<Alert> {
    return this.alertRepository.findOneById(id);
  }

  async updateAlert(id: string): Promise<Alert> {
    return this.alertRepository.updateAlert(id);
  }

  remove(id: number) {
    return `This action removes a #${id} alert`;
  }
}

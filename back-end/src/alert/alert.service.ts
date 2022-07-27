import { Injectable } from '@nestjs/common';
import { AlertDto } from './dto/alert.dto';
import { Alert } from './entities/alert.entity';
import { AlertRepository } from './alert.Repository';
import { UserRepository } from 'src/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(AlertRepository)
    private alertRepository: AlertRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createAlert(alertDto: AlertDto): Promise<void> {
    const requestor = await this.userRepository.findByNickname(
      alertDto.requestor,
    );
    const receiver = await this.userRepository.findByNickname(
      alertDto.receiver,
    );
    return this.alertRepository.createAlert(requestor, receiver);
  }

  //async findAll() {}

  async findOneById(id: string): Promise<Alert> {
    return this.alertRepository.findOneById(id);
  }

  update(id: number, alertDto: AlertDto) {
    return `This action updates a #${id} alert`;
  }

  remove(id: number) {
    return `This action removes a #${id} alert`;
  }
}

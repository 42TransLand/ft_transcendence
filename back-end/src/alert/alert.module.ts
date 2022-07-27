import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { AlertRepository } from './alert.Repository';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { FriendModule } from 'src/friend/friend.module';
import { UsersModule } from 'src/users/users.module';
import { FriendRepository } from 'src/friend/friend.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([AlertRepository]),
    TypeOrmExModule.forCustomRepository([FriendRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}

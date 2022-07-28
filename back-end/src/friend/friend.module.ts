import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { FriendController } from './friend.controller';
import { FriendRepository } from './friend.repository';
import { FriendService } from './friend.service';
import { AlertService } from 'src/alert/alert.service';
import { AlertModule } from 'src/alert/alert.module';
import { AlertRepository } from 'src/alert/alert.Repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([FriendRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    TypeOrmExModule.forCustomRepository([AlertRepository]),
  ],
  controllers: [FriendController],
  providers: [FriendService, UsersService, AlertService],
})
export class FriendModule {}

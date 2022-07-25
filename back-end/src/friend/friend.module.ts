import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { FriendController } from './friend.controller';
import { FriendRepository } from './friend.repository';
import { FriendService } from './friend.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([FriendRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],
  controllers: [FriendController],
  providers: [FriendService, UsersService],
})
export class FriendModule {}

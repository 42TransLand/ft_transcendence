import { Module } from '@nestjs/common';
import { DmService } from './dm.service';
import { DmController } from './dm.controller';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { DMRepository } from './dm.repository';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { FriendRepository } from 'src/friend/friend.repository';
import { SocketModule } from 'src/socket/socket.module';
import { FriendService } from 'src/friend/friend.service';
import { AlertService } from 'src/alert/alert.service';
import { AlertRepository } from 'src/alert/alert.Repository';
import { GameRepository } from 'src/game/game.repository';
import { GameService } from 'src/game/game.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([DMRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    TypeOrmExModule.forCustomRepository([GameRepository]),
    TypeOrmExModule.forCustomRepository([FriendRepository]),
    TypeOrmExModule.forCustomRepository([AlertRepository]),
    SocketModule,
  ],
  controllers: [DmController],
  providers: [
    DmService,
    UsersService,
    GameService,
    FriendService,
    AlertService,
  ],
})
export class DmModule {}

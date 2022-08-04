import { Module } from '@nestjs/common';
import { ChatRoomRepository } from 'src/chat/chat.room.repository';
import { ChatService } from 'src/chat/chat.service';
import { ChatUserRepository } from 'src/chat/chat.user.repository';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { GameRepository } from 'src/game/game.repository';
import { GameService } from 'src/game/game.service';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { SocketGameService } from './game/socket-game.service';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    TypeOrmExModule.forCustomRepository([GameRepository]),
    TypeOrmExModule.forCustomRepository([ChatRoomRepository]),
    TypeOrmExModule.forCustomRepository([ChatUserRepository]),
  ],
  controllers: [],
  providers: [
    SocketGateway,
    SocketService,
    SocketGameService,
    UsersService,
    GameService,
    ChatService,
  ],
  exports: [SocketGateway],
})
export class SocketModule {}

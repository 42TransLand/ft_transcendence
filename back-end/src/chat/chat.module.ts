import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { ChatRoomRepository } from './chat.room.repository';
import { ChatUserRepository } from './chat.user.repository';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/users.repository';
import { SocketModule } from 'src/socket/socket.module';
import { GameRepository } from 'src/game/game.repository';
import { GameService } from 'src/game/game.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ChatRoomRepository]),
    TypeOrmExModule.forCustomRepository([ChatUserRepository]),
    TypeOrmExModule.forCustomRepository([GameRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    SocketModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, GameService, UsersService],
})
export class ChatModule {}

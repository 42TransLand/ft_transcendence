import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { ChatRoomRepository } from './chat.room.repository';
import { ChatUserRepository } from './chat.user.repository';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/users.repository';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ChatRoomRepository]),
    TypeOrmExModule.forCustomRepository([ChatUserRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    SocketModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, UsersService],
})
export class ChatModule {}

import { Module } from '@nestjs/common';
import { SocketGameService } from './game/socket-game.service';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketGateway, SocketService, SocketGameService],
})
export class SocketModule {}

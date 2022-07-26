import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import PlayerMoveDto from './game/dto/player.move.dto';
import { SocketService } from './socket.service';

@WebSocketGateway({ transports: ['websocket'], namespace: 'socket' })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  constructor(private readonly socketService: SocketService) {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    // eslint-disable-next-line no-console
    console.log('Client connected');

    const roomId = `GAME-${socket.handshake.query.roomId as string}`;

    // eslint-disable-next-line no-console
    console.log(`[${socket.conn.remoteAddress}] RoomId: ${roomId}`);

    let roomNum = (await socket.to(roomId).allSockets()).size;
    if (roomNum >= 2) {
      socket.emit('error', { reason: 'Exceed full' });
      return;
    }
    socket.join(roomId);
    roomNum = (await socket.to(roomId).allSockets()).size;
    if (roomNum === 1) {
      // Left side player
      socket.emit('gameInfo', {
        gameMode: 'classic',
        myIndex: 0,
        opponentIndex: 1,
      });
    } else {
      // Right side player
      socket.emit('gameInfo', {
        gameMode: 'classic',
        myIndex: 1,
        opponentIndex: 0,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleDisconnection(@ConnectedSocket() client: Socket) {
    // eslint-disable-next-line no-console
    console.log('Client disconnected');
  }

  @SubscribeMessage('move')
  handleMove(
    @MessageBody() moveDto: PlayerMoveDto,
    @ConnectedSocket() socket: Socket,
  ) {}

  //@SubscribeMessage('inviteMatch')
  //handleInviteMatch(
  //  @ConnectedSocket() socket: Socket,
  //  @MessageBody() {  },
}

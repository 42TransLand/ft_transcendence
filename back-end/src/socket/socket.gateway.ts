/* eslint-disable no-console */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserContext } from './class/user.class';
import { SocketGameService } from './game/socket-game.service';
import { SocketService } from './socket.service';
import PlayerMoveReqDto from './game/dto/req/player.move.req.dto';
import BaseResultDto from './game/dto/base.result.dto';
import { SocketEventName } from './game/constants/game.constants';
import { randomUUID } from 'crypto';

@WebSocketGateway({ transports: ['websocket'], namespace: 'socket' })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userContexts: Map<string, UserContext> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(
    private readonly socketService: SocketService,
    private readonly socketGameService: SocketGameService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const userToken = randomUUID(); // client.handshake.query.token as string;
    const socketId = client.id;

    this.userContexts.set(
      socketId,
      new UserContext(socketId, this.server, client, userToken),
    );

    console.log(
      `Client connected with token: ${userToken} | socketId: ${socketId} | User: ${this.userContexts.size}`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userContext = this.userContexts.get(client.id);

    if (userContext) {
      this.socketGameService.disconnect(userContext);
      this.userContexts.delete(client.id);
    }

    console.log('Client disconnected');
  }

  @SubscribeMessage(SocketEventName.GAME_ENQUEUE_MATCH_REQ)
  handleGameEnqueueMatch(@ConnectedSocket() client: Socket) {
    try {
      const userContext = this.userContexts.get(client.id);
      console.log(
        `GameEnqueueMatchReq: ${client.id} | User: ${this.userContexts.size}`,
      );

      if (userContext) {
        this.socketGameService.enqueue(userContext);
        client.emit(SocketEventName.GAME_ENQUEUE_MATCH_RES, <BaseResultDto>{
          success: true,
        });
      } else throw new Error('No user');
    } catch (e) {
      client.emit(SocketEventName.GAME_ENQUEUE_MATCH_RES, <BaseResultDto>{
        success: false,
        error: e.message,
      });
    }
  }

  @SubscribeMessage(SocketEventName.PLAYER_MOVE_REQ)
  handleGameMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: PlayerMoveReqDto,
  ) {
    try {
      const userContext = this.userContexts.get(client.id);

      if (userContext) {
        const { value: room, done } = userContext.gameRooms.values().next();
        if (done) {
          throw new Error('No game');
        }
        room.move(userContext, dto);
      }
      throw new Error('No user');
    } catch {
      // Ignore
    }
  }
}

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
import GameCreateReqDto from './game/dto/req/game.create.req.dto';
import { SocketGameService } from './game/socket-game.service';
import { SocketService } from './socket.service';
import GameJoinResDto from './game/dto/res/game.join.res';
import GameJoinReqDto from './game/dto/req/game.join.req.dto';
import GameCreateResDto from './game/dto/res/game.create.res';
import PlayerMoveReqDto from './game/dto/req/player.move.req.dto';
import BaseResultDto from './game/dto/base.result.dto';
import { SocketEventName } from './game/dto/constants/game.constants';

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
    const userToken = client.handshake.query.token as string;
    const socketId = client.id;

    this.userContexts[socketId] = new UserContext(
      socketId,
      this.server,
      client,
      userToken,
    );

    // eslint-disable-next-line no-console
    console.log('Client connected');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userContext = this.userContexts.get(client.id);

    if (userContext) {
      this.socketGameService.leaveRoom(userContext);
      this.userContexts.delete(client.id);
    }

    // eslint-disable-next-line no-console
    console.log('Client disconnected');
  }

  @SubscribeMessage(SocketEventName.GAME_CREATE_REQ)
  handleGameCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: GameCreateReqDto,
  ) {
    try {
      const userContext = this.userContexts.get(client.id);

      if (userContext) {
        const room = this.socketGameService.createRoom(
          userContext,
          dto.gameMode,
          dto.ladder,
          dto.scoreForWin,
        );
        client.emit(SocketEventName.GAME_CREATE_RES, <GameCreateResDto>{
          success: true,
          gameMode: room.gameMode,
          ladder: room.ladder,
          scoreForWin: room.scoreForWin,
          myIndex: room.findIndex(userContext),
        });
      }
      throw new Error('No user');
    } catch (e) {
      client.emit(SocketEventName.GAME_CREATE_RES, <BaseResultDto>{
        success: false,
        error: e.message,
      });
    }
  }

  @SubscribeMessage(SocketEventName.GAME_JOIN_REQ)
  handleGameJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: GameJoinReqDto,
  ) {
    try {
      const userContext = this.userContexts.get(client.id);

      if (userContext) {
        if (userContext.gameRooms.size > 0)
          throw new Error('Already joined in other game');

        const room = this.socketGameService.joinRoom(userContext, dto.roomId);
        client.emit(SocketEventName.GAME_JOIN_RES, <GameJoinResDto>{
          success: true,
          gameMode: room.gameMode,
          ladder: room.ladder,
          scoreForWin: room.scoreForWin,
          myIndex: room.findIndex(userContext),
        });
      }
      throw new Error('No user');
    } catch (e) {
      client.emit(SocketEventName.GAME_JOIN_RES, <BaseResultDto>{
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

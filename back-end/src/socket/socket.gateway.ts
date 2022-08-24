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
import { SocketGameService } from './game/socket-game.service';
import { SocketService } from './socket.service';
import PlayerMoveReqDto from './game/dto/req/player.move.req.dto';
import GameMatchDto from './game/dto/req/game.match.dto';
import { SocketEventName } from './game/constants/game.constants';
import { Injectable, Logger } from '@nestjs/common';
import { GameSpectateReqDto } from './game/dto/req/game.spectate.req.dto';
import { ChatUserUpdateType } from './chat/constants/chat.user.update.type.enum';
import GameInviteDto from './game/dto/req/game.invite.dto';

@Injectable()
@WebSocketGateway({ transports: ['websocket'], namespace: 'socket' })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(
    private readonly socketService: SocketService,
    private readonly socketGameService: SocketGameService,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    this.socketService.handleConnection(client, this.server);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.socketService.handleDisconnect(client);
  }

  // 채팅방

  // 게임
  @SubscribeMessage(SocketEventName.GAME_ENQUEUE_MATCH_REQ)
  handleGameEnqueueMatch(@ConnectedSocket() client: Socket) {
    this.socketService.handleGameEnqueueMatch(client);
  }

  @SubscribeMessage(SocketEventName.GAME_LEAVE_REQ)
  handleGameLeave(@ConnectedSocket() client: Socket) {
    this.socketService.handleGameLeave(client);
  }

  @SubscribeMessage(SocketEventName.PLAYER_MOVE_REQ)
  handleGameMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: PlayerMoveReqDto,
  ) {
    this.socketService.handleGameMove(client, dto);
  }

  @SubscribeMessage(SocketEventName.GAME_INVITE_REQ)
  handleGameInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { gameMode, scoreForWin, opponentNickname }: GameInviteDto, // dto 순서
  ) {
    this.socketService.handleGameInvite(
      client,
      gameMode,
      scoreForWin,
      opponentNickname,
      this.server,
    );
  }

  @SubscribeMessage(SocketEventName.GAME_ACCEPT_REQ)
  async handleGameAccept(
    @ConnectedSocket() client: Socket,
    @MessageBody() { opponentNickname }: GameMatchDto,
  ) {
    this.socketService.handleGameAccept(client, opponentNickname);
  }

  @SubscribeMessage(SocketEventName.GAME_REFUSE_REQ)
  handleGameDecline(
    @ConnectedSocket() client: Socket,
    @MessageBody() { opponentNickname }: GameMatchDto,
  ) {
    this.socketService.handleGameDecline(client, opponentNickname, this.server);
  }

  @SubscribeMessage(SocketEventName.GAME_SPECTATE_REQ)
  async handleGameSpectateRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() { nickname }: GameSpectateReqDto,
  ) {
    this.socketService.handleGameSpectateRequest(client, nickname);
  }
}

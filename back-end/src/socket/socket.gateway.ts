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
import GameMatchDto from './game/dto/req/game.match.dto';
import BaseResultDto from './game/dto/base.result.dto';
import { SocketEventName } from './game/constants/game.constants';
import { Room } from './game/class/room.class';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { GameService } from 'src/game/game.service';
import { ChatDto } from './game/dto/chat.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ transports: ['websocket'], namespace: 'socket' })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userContexts: Map<string, UserContext> = new Map(); // key: socketId

  private usersSocket: Map<number, string> = new Map(); // key: userId(나중에 string으로 교체), value: socketId

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(
    private readonly socketService: SocketService,
    private readonly socketGameService: SocketGameService,
    private readonly userService: UsersService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const userToken = client.handshake.query.user as string; // nickname
      const socketId = client.id;
      const date = new Date();

      const user: User = await this.userService.findByNickname(userToken);
      if (!user) {
        throw new Error('User Not Found');
      }
      this.userContexts.set(
        socketId,
        new UserContext(socketId, this.server, client, userToken, user, date),
      );
      this.usersSocket.set(user.id, socketId);
      console.log(
        `Client connected with id: ${user.id} | token: ${userToken} | socketId: ${socketId} | User: ${this.userContexts.size}`,
      );
      console.log(this.usersSocket[user.id]);
    } catch (error) {
      // ignore
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const userContext = this.userContexts.get(client.id);
      if (userContext) {
        this.socketGameService.disconnect(userContext);
        this.userContexts.delete(client.id);
      }
      console.log(`Client ${client.id} disconnected`);
    } catch (error) {
      // ignore
    }
  }

  // 채팅방
  @SubscribeMessage('joinChatRoom')
  handleJoinChatRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { id }: ChatDto,
  ): string {
    return this.socketService.handleJoinChatRoom(client, id);
  }

  @SubscribeMessage('leaveChatRoom')
  handleLeaveChatRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { id }: ChatDto,
  ): string {
    return this.socketService.handleLeaveChatRoom(this.server, client, id);
  }

  // 채팅방에 메세지 보내기
  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatdto: ChatDto,
  ): void {
    this.socketService.handleSendMessage(this.server, client, chatdto);
  }

  // 채팅방

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

  @SubscribeMessage(SocketEventName.GAME_LEAVE_REQ)
  handleGameLeave(@ConnectedSocket() client: Socket) {
    try {
      const userContext = this.userContexts.get(client.id);
      if (userContext) {
        this.socketGameService.disconnect(userContext);
      }
      console.log(`Client ${client.id} leaved game screen`);
    } catch (error) {
      // ignore
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
        room.movePlayer(userContext, dto);
      }
      throw new Error('No user');
    } catch {
      // Ignore
    }
  }

  @SubscribeMessage(SocketEventName.GAME_INVITE_REQ)
  async handleGameInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameMatchDto: GameMatchDto,
  ) {
    try {
      const opponent: User = await this.userService.findByNickname(
        gameMatchDto.opponentNickname,
      );
      if (opponent) {
        const opponentSocket = this.usersSocket.get(opponent.id);
        this.server.to(opponentSocket).emit(SocketEventName.GAME_INVITE_RES, {
          mode: gameMatchDto.gameMode,
          opponentSocket: client.id,
        });
      } else throw new Error('No user');
    } catch (e) {
      client.emit(SocketEventName.GAME_INVITE_RES, <BaseResultDto>{
        success: false,
        error: e.message,
      });
    }
  }

  @SubscribeMessage(SocketEventName.GAME_ACCEPT_REQ)
  async handleGameAccept(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameMatchDto: GameMatchDto,
  ) {
    try {
      const opponent: User = await this.userService.findByNickname(
        gameMatchDto.opponentNickname,
      );
      if (opponent) {
        // find socket
        const opponentSocket = this.usersSocket.get(opponent.id);

        // find Context
        const userContext = this.userContexts.get(client.id);
        const opponentContext = this.userContexts.get(opponentSocket);

        this.socketGameService.createGame(
          userContext,
          opponentContext,
          gameMatchDto.gameMode,
          false,
          10,
        );
      } else throw new Error('No user');
    } catch (e) {
      client.emit(SocketEventName.GAME_ACCEPT_RES, <BaseResultDto>{
        success: false,
        error: e.message,
      });
    }
  }

  @SubscribeMessage(SocketEventName.GAME_REFUSE_REQ)
  async handleGameDecline(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameMatchDto: GameMatchDto,
  ) {
    try {
      const opponent: User = await this.userService.findByNickname(
        gameMatchDto.opponentNickname,
      );
      if (opponent) {
        // find socket
        const opponentSocket = this.usersSocket.get(opponent.id);

        this.server.to(opponentSocket).emit(SocketEventName.GAME_REFUSE_RES, {
          message: `Your invitation has been refused`,
        });
      } else throw new Error('No user');
    } catch (e) {
      client.emit(SocketEventName.GAME_ACCEPT_RES, <BaseResultDto>{
        success: false,
        error: e.message,
      });
    }
  }
}

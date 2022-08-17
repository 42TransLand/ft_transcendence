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
import { ChatService } from 'src/chat/chat.service';
import { ChatDto } from '../chat/dto/chat.dto';
import { Injectable } from '@nestjs/common';
import GameReservation from './class/game.reservation.class';
import GameCreateResDto from './game/dto/res/game.create.res.dto';
import GameJoinResDto from './game/dto/res/game.join.res.dto';

type GameInviteReqDtoType = { scoreForWin: number } & GameMatchDto;

@Injectable()
@WebSocketGateway({ transports: ['websocket'], namespace: 'socket' })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userContexts: Map<string, UserContext> = new Map(); // key: socketId

  private usersSocket: Map<string, string> = new Map(); // key: userId(나중에 string으로 교체), value: socketId

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
      client.join(user.id);
      this.userContexts.set(
        socketId,
        new UserContext(socketId, this.server, client, userToken, user, date),
      );
      this.usersSocket.set(user.id, socketId);
      console.log(
        `Client connected with id: ${user.id} | token: ${userToken} | socketId: ${socketId} | User: ${this.userContexts.size}`,
      );
    } catch (error) {
      // ignore
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const userContext = this.userContexts.get(client.id);
      if (userContext) {
        console.log(`user disconnected: ${userContext.user.nickname}`);
        client.leave(userContext.user.id);
        this.socketGameService.disconnect(userContext);

        if (userContext.chatRoom) {
          this.socketService.handleLeaveChatRoom(userContext);
        }
        this.usersSocket.delete(userContext.user.id);
        this.userContexts.delete(client.id);
      }
      console.log(`Client ${client.id} disconnected`);
    } catch (error) {
      // ignore
    }
  }

  // 채팅방
  // @SubscribeMessage(SocketEventName.CHAT_JOIN_NOTIFY)
  @SubscribeMessage('joinChatRoom')
  handleChatJoinNotify(roomid: string, userId: string): void {
    try {
      const usersSocket = this.usersSocket.get(userId);
      const userContext = this.userContexts.get(usersSocket);
      userContext.chatRoom = roomid;
      console.log(1);
      if (userContext) {
        this.socketService.handleJoinChatRoom(userContext);
      }
    } catch (error) {
      // ignore
    }
  }
  // handleChatJoinNotify(roomid: string, userId: string): void {
  //   try {
  //     const usersSocket = this.usersSocket.get(userId);
  //     const userContext = this.userContexts.get(usersSocket);
  //     userContext.chatRoom = roomid;
  //     console.log(1);
  //     if (userContext) {
  //       this.socketService.handleJoinChatRoom(userContext);
  //     }
  //   } catch (error) {
  //     // ignore
  //   }
  // }

  // @SubscribeMessage(SocketEventName.CHAT_LEAVE_NOTIFY)
  @SubscribeMessage('leaveChatRoom')
  handleChatLeaveNotify(roomid: string, userId: string): void {
    try {
      const usersSocket = this.usersSocket.get(userId);
      const userContext = this.userContexts.get(usersSocket);
      userContext.chatRoom = roomid;
      if (userContext) {
        this.socketService.handleLeaveChatRoom(userContext);
      }
    } catch (error) {
      // ignore
    }
  }

  // 게임
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
    @MessageBody()
    { gameMode, scoreForWin, opponentNickname }: GameInviteReqDtoType,
  ) {
    try {
      const user = this.userContexts.get(client.id);
      user.gameReservation = new GameReservation(gameMode, scoreForWin);

      const opponent: User = await this.userService.findByNickname(
        opponentNickname,
      );
      if (opponent) {
        const opponentSocket = this.usersSocket.get(opponent.id);
        if (opponentSocket) {
          this.server
            .to(opponentSocket)
            .emit(SocketEventName.GAME_INVITE_NOTIFY, {
              gameMode,
              opponentNickname: user.user.nickname,
              scoreForWin,
            });
          client.emit(SocketEventName.GAME_INVITE_RES, <BaseResultDto>{
            success: true,
          });
        } else throw new Error('상대가 접속중이 아닙니다.');
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
        const opponentContext = this.userContexts.get(opponentSocket);
        if (opponentContext) {
          // find Context
          const userContext = this.userContexts.get(client.id);
          const { gameMode, scoreForWin } = opponentContext.gameReservation;

          // TODO: 초대한 시점과 시간을 비교해서 초대가 만료되었는지 검사?

          this.socketGameService.createGame(
            opponentContext,
            userContext,
            gameMode,
            false,
            scoreForWin,
          );
          opponentContext.socket.emit(SocketEventName.GAME_CREATE_RES, <
            GameCreateResDto
          >{
            gameMode,
            ladder: false,
            scoreForWin,
            myIndex: 0,
          });
          client.emit(SocketEventName.GAME_JOIN_RES, <GameJoinResDto>{
            gameMode,
            ladder: false,
            scoreForWin,
            myIndex: 1,
          });
        } else throw new Error('초대한 사용자를 찾을 수 없습니다.');
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
          message: '상대가 게임 초대를 거절했습니다.',
        });
      } else throw new Error('No user');
    } catch (e) {
      client.emit(SocketEventName.GAME_REFUSE_RES, <BaseResultDto>{
        success: false,
        error: e.message,
      });
    }
  }
}

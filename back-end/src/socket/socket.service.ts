import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatJoinNotifyDto } from 'src/socket/chat/dto/chat.join.notify.dto';
import { ChatLeaveNotifyDto } from 'src/socket/chat/dto/chat.leave.notify.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ChatUserUpdateType } from './chat/constants/chat.user.update.type.enum';
import UserState from './chat/constants/state.user.enum';
import { ChatMessageNotifyDto } from './chat/dto/chat.message.notify.dto';
import { ChatUpdateProtectionNotifyDto } from './chat/dto/chat.update.protection.notify.dto';
import { ChatUpdateUserNotifyDto } from './chat/dto/chat.update.user.notify.dto';
import { UserContext } from './class/user.class';
import { SocketEventName } from './game/constants/game.constants';
import { SocketStateService } from './socket-state.service';
import { SocketStorageService } from './socket-storage.service';
import { SocketGameService } from './game/socket-game.service';
import { FriendService } from 'src/friend/friend.service';
import { GameSpectateResDto } from './game/dto/res/game.spectate.res.dto';
import BaseResultDto from './game/dto/base.result.dto';
import GameJoinResDto from './game/dto/res/game.join.res.dto';
import GameCreateResDto from './game/dto/res/game.create.res.dto';
import GameReservation from './class/game.reservation.class';
import { GameMode } from 'src/game/constants/game.mode.enum';
import PlayerMoveReqDto from './game/dto/req/player.move.req.dto';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(`SocketService`);

  constructor(
    private readonly userService: UsersService,
    private readonly friendService: FriendService,
    private readonly socketStateService: SocketStateService,
    private readonly socketGameService: SocketGameService,
    private readonly socketStorageService: SocketStorageService,

    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  private async getFriends(user: UserContext) {
    const friends = await this.friendService.findAllFriends(user.user);
    return friends
      .filter((friend) => !friend.isBlocked)
      .map((friend) => friend.id);
  }

  private async changeUserState(user: UserContext, state: UserState) {
    const friends = await this.getFriends(user);
    await this.socketStateService.onChangeState(user, state, friends);
  }

  private async retrieveUserStateFromFriends(user: UserContext) {
    const friends = await this.getFriends(user);
    await this.socketStateService.retrieveState(user.user.id, friends);
  }

  async handleConnection(@ConnectedSocket() client: Socket, server: Server) {
    try {
      const userToken = client.handshake.query.user as string; // nickname
      const socketId = client.id;
      const date = new Date();

      const user: User = await this.userService.findByNickname(userToken);
      if (!user) {
        throw new Error('User Not Found');
      }
      client.join(user.id);
      const userContext = new UserContext(
        socketId,
        server,
        client,
        userToken,
        user,
        date,
      );
      this.socketStorageService.setUserContext(socketId, userContext);
      this.socketStorageService.setUserSocket(user.id, socketId);
      this.logger.debug(
        `Client connected with id: ${
          user.id
        } | token: ${userToken} | socketId: ${socketId} | User: ${this.socketStorageService.getUserContextSize()}`,
      );
      await this.changeUserState(userContext, UserState.ONLINE);
      await this.retrieveUserStateFromFriends(userContext);
    } catch (error) {
      // ignore
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const userContext = this.socketStorageService.getUserContext(client.id);
      if (userContext) {
        await this.changeUserState(userContext, UserState.OFFLINE);
        this.logger.debug(`user disconnected: ${userContext.user.nickname}`);
        client.leave(userContext.user.id);
        this.socketGameService.disconnect(userContext);

        if (userContext.chatRoom) {
          await this.chatService.leaveChatRoom(
            userContext.chatRoom,
            userContext.user,
          );
        }
        this.socketStorageService.removeUserSocket(userContext.user.id);
        this.socketStorageService.removeUserContext(client.id);
      }
      this.logger.debug(`Client ${client.id} disconnected`);
    } catch (error) {
      // ignore
    }
  }

  handleJoinChatRoom(roomid: string, userId: string): void {
    try {
      const usersSocket = this.socketStorageService.getUserSocket(userId);
      const userContext = this.socketStorageService.getUserContext(usersSocket);
      if (userContext) {
        userContext.chatRoom = roomid;
        userContext.socket.join(userContext.chatRoom);
        userContext.server
          .to(userContext.chatRoom)
          .emit(SocketEventName.CHAT_JOIN_NOTIFY, <ChatJoinNotifyDto>{
            nickname: userContext.user.nickname,
            profileImg: userContext.user.profileImg,
            id: userContext.user.id,
          });
      }
    } catch (error) {
      // ignore
    }
  }

  handleLeaveChatRoom(userId: string, type: ChatUserUpdateType): void {
    try {
      const usersSocket = this.socketStorageService.getUserSocket(userId);
      const userContext = this.socketStorageService.getUserContext(usersSocket);
      if (userContext) {
        if (type === ChatUserUpdateType.KICK) {
          userContext.server
            .to(userContext.chatRoom)
            .emit(SocketEventName.CHAT_UPDATE_USER_NOTIFY, <
              ChatUpdateUserNotifyDto
            >{
              id: userContext.user.id,
              nickname: userContext.user.nickname,
              type: ChatUserUpdateType.KICK,
              status: true,
            });
        } else if (type === ChatUserUpdateType.LEAVE) {
          userContext.server
            .to(userContext.chatRoom)
            .emit(SocketEventName.CHAT_LEAVE_NOTIFY, <ChatLeaveNotifyDto>{
              nickname: userContext.user.nickname,
            });
        } else if (type === ChatUserUpdateType.BAN) {
          userContext.server
            .to(userContext.chatRoom)
            .emit(SocketEventName.CHAT_UPDATE_USER_NOTIFY, <ChatLeaveNotifyDto>{
              nickname: userContext.user.nickname,
              type: ChatUserUpdateType.BAN,
              status: true,
            });
        }
        userContext.socket.leave(userContext.chatRoom);
        userContext.chatRoom = null;
      }
    } catch (error) {
      // ignore
    }
  }

  handleChatMessage(
    server: Server,
    nickname: string,
    chatId: string,
    content: string,
  ): void {
    server.to(chatId).emit(SocketEventName.CHAT_MESSAGE_NOTIFY, <
      ChatMessageNotifyDto
    >{
      nickname,
      content,
    });
  }

  handleSendDM(senderId: string, receiverId: string, content: string) {
    try {
      const senderSocket = this.socketStorageService.getUserSocket(senderId);
      const senderContext =
        this.socketStorageService.getUserContext(senderSocket);
      const receiverSocket =
        this.socketStorageService.getUserSocket(receiverId);
      const receiverContext =
        this.socketStorageService.getUserContext(receiverSocket);
      if (senderContext && receiverContext) {
        senderContext.server
          .to(receiverContext.id)
          .emit(SocketEventName.CHAT_MESSAGE_NOTIFY, <ChatMessageNotifyDto>{
            nickname: senderContext.user.nickname,
            content,
          });
      }
    } catch (error) {
      // ignore
    }
  }

  handleUpdateChatType(server: Server, chatRoomId: string, isChange: boolean) {
    server.to(chatRoomId).emit(SocketEventName.CHAT_UPDATE_PROTECTION_NOTIFY, <
      ChatUpdateProtectionNotifyDto
    >{
      status: isChange,
    });
  }

  handleUpdateChatUser(
    server: Server,
    chatRoomId: string,
    userId: string,
    nickname: string,
    type: ChatUserUpdateType,
    status: boolean,
  ) {
    server.to(chatRoomId).emit(SocketEventName.CHAT_UPDATE_USER_NOTIFY, <
      ChatUpdateUserNotifyDto
    >{
      id: userId,
      nickname,
      type,
      status,
    });
  }

  // game part

  async handleGameEnqueueMatch(@ConnectedSocket() client: Socket) {
    try {
      const userContext = this.socketStorageService.getUserContext(client.id);
      this.logger.debug(
        `GameEnqueueMatchReq: ${
          client.id
        } | User: ${this.socketStorageService.getUserContextSize()}`,
      );

      if (userContext) {
        await this.changeUserState(userContext, UserState.INGAME);
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

  async handleGameLeave(@ConnectedSocket() client: Socket) {
    try {
      const userContext = this.socketStorageService.getUserContext(client.id);
      if (userContext) {
        this.socketGameService.disconnect(userContext);
        await this.changeUserState(userContext, UserState.ONLINE);
      }
      this.logger.debug(`Client ${client.id} leaved game screen`);
    } catch (error) {
      // ignore
    }
  }

  handleGameMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: PlayerMoveReqDto,
  ) {
    try {
      const userContext = this.socketStorageService.getUserContext(client.id);

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

  async handleGameInvite(
    @ConnectedSocket() client: Socket,
    gameMode: GameMode,
    scoreForWin: number,
    opponentNickname: string,
    server: Server,
  ) {
    try {
      const user = this.socketStorageService.getUserContext(client.id);
      user.gameReservation = new GameReservation(gameMode, scoreForWin);

      const opponent: User = await this.userService.findByNickname(
        opponentNickname,
      );
      if (opponent) {
        const opponentSocket = this.socketStorageService.getUserSocket(
          opponent.id,
        );
        if (opponentSocket) {
          server.to(opponentSocket).emit(SocketEventName.GAME_INVITE_NOTIFY, {
            gameMode,
            opponentNickname: user.user.nickname,
            scoreForWin,
          });
          await this.changeUserState(user, UserState.INGAME);
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

  async handleGameAccept(
    @ConnectedSocket() client: Socket,
    opponentNickname: string,
  ) {
    try {
      const opponent: User = await this.userService.findByNickname(
        opponentNickname,
      );
      if (opponent) {
        // find socket
        const opponentSocket = this.socketStorageService.getUserSocket(
          opponent.id,
        );
        const opponentContext =
          this.socketStorageService.getUserContext(opponentSocket);
        if (opponentContext) {
          // find Context
          const userContext = this.socketStorageService.getUserContext(
            client.id,
          );
          const { gameMode, scoreForWin } = opponentContext.gameReservation;

          this.socketGameService.createGame(
            opponentContext,
            userContext,
            gameMode,
            false,
            scoreForWin,
          );
          await this.changeUserState(userContext, UserState.INGAME);
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

  async handleGameDecline(
    @ConnectedSocket() client: Socket,
    opponentNickname: string,
    server: Server,
  ) {
    try {
      const opponent: User = await this.userService.findByNickname(
        opponentNickname,
      );
      if (opponent) {
        // find socket
        const opponentSocket = this.socketStorageService.getUserSocket(
          opponent.id,
        );
        const opponentContext =
          this.socketStorageService.getUserContext(opponentSocket);

        await this.changeUserState(opponentContext, UserState.INGAME);
        server.to(opponentSocket).emit(SocketEventName.GAME_REFUSE_RES, {
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

  async handleGameSpectateRequest(
    @ConnectedSocket() client: Socket,
    nickname: string,
  ) {
    try {
      const opponent = await this.userService.findByNickname(nickname);
      const user = this.socketStorageService.getUserContext(client.id);

      if (opponent) {
        const opponentSocket = this.socketStorageService.getUserSocket(
          opponent.id,
        );
        const opponentContext =
          this.socketStorageService.getUserContext(opponentSocket);
        if (opponentContext) {
          const { value: room, done } = opponentContext.gameRooms
            .values()
            .next();
          if (done) {
            throw new Error('No game');
          }
          room.joinSpectator(user);
          client.emit(SocketEventName.GAME_SPECTATE_RES, <GameSpectateResDto>{
            success: true,
          });
          await this.changeUserState(user, UserState.OBSERVE);
        }
        throw new Error('No user');
      }
      throw new Error('No user');
    } catch (e) {
      client.emit(SocketEventName.GAME_SPECTATE_RES, <BaseResultDto>{
        success: false,
        error: e.message,
      });
    }
  }
}

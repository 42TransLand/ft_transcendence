import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import UserState from './chat/constants/state.user.enum';
import StateUpdateUserNotifyDto from './chat/dto/state.update.user.notify.dto';
import { UserContext } from './class/user.class';
import { UserConnected } from './class/user.connected.class';
import { SocketEventName } from './game/constants/game.constants';

@Injectable()
export class SocketStateService {
  private readonly logger = new Logger(SocketStateService.name);

  // key: socket.id
  private readonly connectedUsers = new Map<string, UserConnected>();

  async onChangeState(
    user: UserContext,
    state: UserState,
    notificationTargetUserIds?: string[],
  ) {
    let connectedUser = this.connectedUsers.get(user.id);
    if (state === UserState.ONLINE) {
      connectedUser = this.newConnectedUser(user);
    }
    if (connectedUser) {
      connectedUser.state = state;
      this.executeTargets(notificationTargetUserIds, (entry) => {
        this.emit(entry.socket, user.user.id, connectedUser.state);
      });
    }
    if (state === UserState.OFFLINE) {
      this.connectedUsers.delete(user.id);
    }
  }

  async retrieveState(selfUserId: string, desiredToKnowUserIds: string[]) {
    const self = this.findByUserId(selfUserId);
    if (!self) return;

    this.executeTargets(desiredToKnowUserIds, (entry) => {
      this.emit(self.socket, entry.userId, entry.state);
    });
  }

  notifyOneByUserId(selfUserId: string, targetUserId: string) {
    const target = this.findByUserId(targetUserId);
    if (!target) return;

    this.emit(target.socket, selfUserId, this.getCurrentState(selfUserId));
  }

  getCurrentState(userId: string) {
    const user = this.findByUserId(userId);
    if (!user) return UserState.OFFLINE;
    return user.state;
  }

  private newConnectedUser(user: UserContext) {
    const connectedUser = new UserConnected(user.user.id, user.socket);
    connectedUser.state = UserState.ONLINE;
    this.connectedUsers.set(user.id, connectedUser);
    return connectedUser;
  }

  private findByUserId(userId: string) {
    let ret: UserConnected | null = null;
    const iterator = this.connectedUsers.values();
    for (;;) {
      const { value, done } = iterator.next();
      if (done) break;
      if (value.userId === userId) {
        ret = value;
        break;
      }
    }
    return ret;
  }

  private executeTargets(
    targetUserIds: string[],
    callback: (target: UserConnected) => void,
  ) {
    this.connectedUsers.forEach((entry) => {
      if (targetUserIds.includes(entry.userId)) {
        callback(entry);
      }
    });
  }

  private emit(target: Socket, userId: string, state: UserState) {
    target.emit(SocketEventName.STATE_UPDATE_USER_NOTIFY, <
      StateUpdateUserNotifyDto
    >{
      id: userId,
      state,
    });
  }
}

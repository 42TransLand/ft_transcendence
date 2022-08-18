import { Injectable, Logger } from '@nestjs/common';
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
    this.logger.debug(
      `[${user.user.id}] change state to ${state} from ${
        connectedUser?.state ?? 'UNKNOWN'
      }`,
    );
    if (state === UserState.ONLINE) {
      connectedUser = new UserConnected(user.user.id, user.socket);
      connectedUser.state = state;
      this.connectedUsers.set(user.id, connectedUser);
    }
    if (connectedUser) {
      connectedUser.state = state;

      this.executeTargets(notificationTargetUserIds, (entry) => {
        this.logger.debug(
          `[${user.user.id}] send to friend ${entry.userId} state '${entry.state}'`,
        );
        entry.socket.emit(SocketEventName.STATE_UPDATE_USER_NOTIFY, <
          StateUpdateUserNotifyDto
        >{
          id: user.user.id,
          state: connectedUser.state,
        });
      });
    }
    if (state === UserState.OFFLINE) {
      this.connectedUsers.delete(user.id);
    }
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

  async retrieveState(selfUserId: string, desiredToKnowUserIds: string[]) {
    const self = this.findByUserId(selfUserId);

    // no self user found
    if (!self) return;

    this.executeTargets(desiredToKnowUserIds, (entry) => {
      this.logger.debug(
        `[${selfUserId}] retrieve state from friend ${entry.userId} state '${entry.state}'`,
      );
      self.socket.emit(SocketEventName.STATE_UPDATE_USER_NOTIFY, <
        StateUpdateUserNotifyDto
      >{
        id: entry.userId,
        state: entry.state,
      });
    });
  }

  executeTargets(
    targetUserIds: string[],
    callback: (target: UserConnected) => void,
  ) {
    this.connectedUsers.forEach((entry) => {
      if (targetUserIds.includes(entry.userId)) {
        callback(entry);
      }
    });
  }

  notifyTo(selfUserId: string, targetUserId: string) {
    const self = this.findByUserId(selfUserId);
    const target = this.findByUserId(targetUserId);

    // no self user found
    if (!self || !target) return;

    target.socket.emit(SocketEventName.STATE_UPDATE_USER_NOTIFY, <
      StateUpdateUserNotifyDto
    >{
      id: selfUserId,
      state: self.state,
    });
  }
}

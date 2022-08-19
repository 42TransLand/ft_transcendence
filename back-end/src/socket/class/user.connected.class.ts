import { Socket } from 'socket.io';
import UserState from '../chat/constants/state.user.enum';

export class UserConnected {
  public state: UserState;

  constructor(public readonly userId: string, public readonly socket: Socket) {}
}

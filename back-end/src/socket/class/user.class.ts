import { Server, Socket } from 'socket.io';
import { Room } from '../game/class/room.class';
import { User } from 'src/users/entities/user.entity';

export class UserContext {
  public readonly gameRooms: Set<Room>;

  public readonly gamesOnView: Set<Room>;

  // DM
  // 채팅방
  // 알림

  constructor(
    public readonly id: string,
    public readonly server: Server,
    public readonly socket: Socket,
    public readonly token: string,
    public readonly user: User,
    public readonly time: Date,
  ) {
    this.gameRooms = new Set();
    this.gamesOnView = new Set();
  }
}

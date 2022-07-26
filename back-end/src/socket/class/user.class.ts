import { Server, Socket } from 'socket.io';
import { Room } from '../game/class/room.class';

export class UserContext {
  public readonly gameRooms: Set<Room>;

  public readonly gamesOnView: Set<Room>;

  constructor(
    public readonly id: string,
    public readonly server: Server,
    public readonly socket: Socket,
    public readonly token: string,
  ) {
    this.gameRooms = new Set();
    this.gamesOnView = new Set();
  }
}

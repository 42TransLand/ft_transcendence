import { Server, Socket } from 'socket.io';
import { Room } from '../game/class/room.class';
import { User } from 'src/users/entities/user.entity';
import GameReservation from './game.reservation.class';

export class UserContext {
  public readonly gameRooms: Set<Room>;

  public readonly gamesOnView: Set<Room>;

  public gameReservation: GameReservation | null = null;

  // DM
  // 채팅방
  public chatRoom: string;
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

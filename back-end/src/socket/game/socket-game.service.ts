import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { UserContext } from '../class/user.class';
import { Room } from './class/room.class';
import { GAME_TIME_INTERVAL } from './dto/constants/game.constants';
import GameState from './dto/constants/game.state.enum';

@Injectable()
export class SocketGameService {
  private roomId = 1;

  private rooms: Map<number, Room> = new Map<number, Room>();

  // 게임 방을 생성
  createRoom(
    user: UserContext,
    gameMode: string,
    ladder: boolean,
    scoreForWin: number,
  ) {
    // eslint-disable-next-line no-plusplus
    const roomId = this.roomId++;
    const room = new Room(roomId, gameMode, ladder, scoreForWin);

    room.join(user, 0);
    user.gameRooms.add(room);
    this.rooms.set(roomId, room);
    return room;
  }

  // 게임 방에 입장
  joinRoom(user: UserContext, roomId: number) {
    const room = this.rooms.get(roomId);

    if (room) {
      if (room.isFull()) {
        throw new Error('Exceed full seats');
      }
      room.join(user, 1);
      user.gameRooms.add(room);
      return room;
    }
    throw new Error('No room');
  }

  // 게임 방에서 떠남
  leaveRoom(user: UserContext) {
    // 유저가 입장한 방에서 퇴장 시키고,
    // 퇴장 후 방이 비었다면 방을 삭제.
    user.gameRooms.forEach((room) => room.leave(user));
    user.gameRooms.clear();
  }

  @Interval(GAME_TIME_INTERVAL)
  update() {
    this.rooms.forEach((room, index, rooms) => {
      room.update();
      if (room.state === GameState.ENDED) {
        rooms.delete(index);
      }
    });
  }
}

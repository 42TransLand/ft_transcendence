import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { GameService } from 'src/game/game.service';
import { User } from 'src/users/entities/user.entity';
import { UserContext } from '../class/user.class';
import { Room } from './class/room.class';
import {
  GAME_SCORE_FOR_WIN_LADDER,
  GAME_TIME_INTERVAL,
  SocketEventName,
} from './constants/game.constants';
import GameState from './constants/game.state.enum';
import GameCreateResDto from './dto/res/game.create.res.dto';
import GameJoinResDto from './dto/res/game.join.res.dto';

type DequeueSuccessType = {
  success: true;
  user1: UserContext;
  user2: UserContext;
};
type DequeueFalseType = {
  success: false;
};

@Injectable()
export class SocketGameService {
  constructor(private readonly gameService: GameService) {}

  private rooms: Map<number, Room> = new Map<number, Room>();

  private queues: UserContext[] = [];

  // 게임 큐에 넣기
  enqueue(user: UserContext) {
    if (user.gameRooms.size > 0) {
      throw new Error('Already joined a game');
    }
    if (user.gamesOnView.size > 0) {
      throw new Error('Already in a game on view');
    }
    if (this.queues.indexOf(user) > -1) {
      throw new Error('Already in the queue');
    }
    this.queues.push(user);
  }

  // 큐에서 특정 유저를 삭제하기.
  private leaveQueue(user: UserContext) {
    const index = this.queues.indexOf(user);
    if (index > -1) {
      this.queues.splice(index, 1);
    }
  }

  // 게임 큐에서, 연결되어 있는 플레이어 둘을 꺼내오기.
  private dequeue(): DequeueSuccessType | DequeueFalseType {
    if (this.queues.length < 2) {
      return { success: false };
    }
    const user1 = this.queues.shift();
    const user2 = this.queues.shift();
    if (user1.socket.disconnected) {
      this.queues.unshift(user2);
      return { success: false };
    }
    if (user2.socket.disconnected) {
      this.queues.unshift(user1);
      return { success: false };
    }
    return { success: true, user1, user2 };
  }

  // 테스트용. 실제 서버에서는 아래 메서드를 사용하지 않음.
  private roomIdCounter = 0;

  private testCreateRoom(): { id: number } {
    this.roomIdCounter += 1;
    return { id: this.roomIdCounter };
  }

  // 게임 방을 생성
  createGame(
    user1: UserContext,
    user2: UserContext,
    gameMode: string,
    ladder: boolean,
    scoreForWin: number,
  ) {
    const dbRecordRoom = this.testCreateRoom(); // TODO 실제 DB에서 생성된 방의 ID를 반환받아야 함.

    const room = new Room(dbRecordRoom.id, gameMode, ladder, scoreForWin);

    room.join(user1, 0);
    room.join(user2, 1);
    user1.gameRooms.add(room);
    user2.gameRooms.add(room);
    this.rooms.set(dbRecordRoom.id, room);
    return room;
  }

  // 연결이 끊어져서, 모든 방에서 퇴장시켜야 할 경우.
  disconnect(user: UserContext) {
    // 유저가 입장한 방에서 퇴장 시키고,
    // 퇴장 후 방이 비었다면 방을 삭제.
    user.gameRooms.forEach((room) => room.leave(user));
    user.gameRooms.clear();

    // 관전중인 방도 모두 퇴장
    user.gamesOnView.forEach((room) => room.leaveSpectator(user));
    user.gamesOnView.clear();

    // 큐에 있었다면, 해당 유저를 매칭 큐에서 삭제.
    this.leaveQueue(user);
  }

  @Interval(GAME_TIME_INTERVAL)
  update() {
    this.tryMatch();
    this.rooms.forEach((room, index, rooms) => {
      room.update();
      if (room.state === GameState.ENDED || room.isEmpty()) {
        // TODO 게임이 종료되어, 게임 결과를 저장해야 함
        rooms.delete(index);
      }
    });
  }

  private tryMatch() {
    this.queues = this.queues.filter((user) => user.socket.connected);

    const matched = this.dequeue();
    if (!matched.success) return;

    const { user1, user2 } = matched;
    const room = this.createGame(
      user1,
      user2,
      'classic',
      true,
      GAME_SCORE_FOR_WIN_LADDER,
    );
    user1.socket.emit(SocketEventName.GAME_CREATE_RES, <GameCreateResDto>{
      gameMode: room.gameMode,
      ladder: room.ladder,
      scoreForWin: room.scoreForWin,
      myIndex: 0,
    });
    user2.socket.emit(SocketEventName.GAME_JOIN_RES, <GameJoinResDto>{
      gameMode: room.gameMode,
      ladder: room.ladder,
      scoreForWin: room.scoreForWin,
      myIndex: 1,
    });
    console.log(`Game matched between ${user1.id} and ${user2.id}`);
  }

  
}

import { Player } from './player.class';
import { Ball } from './ball.class';
import GameState from '../dto/constants/game.state.enum';
import {
  GAME_SCREEN_WIDTH,
  GAME_TIME_INTERVAL,
  SocketEventName,
} from '../dto/constants/game.constants';
import { UserContext } from 'src/socket/class/user.class';
import GameEndNotifyDto from '../dto/res/game.end.notify.dto';
import PlayerMoveResDto from '../dto/res/player.move.notify.dto';
import GameScoreDto from '../dto/res/game.score.notify.dto';
import GameReadyNotifyDto from '../dto/res/game.ready.notify.dto';
import GameStateNotifyDto from '../dto/res/game.state.notify.dto';

export class Room {
  private players: Map<string, Player>;

  private spectators: Map<string, UserContext>;

  private ball: Ball;

  private gameState: GameState = GameState.WAITING;

  private gameTime = 0;

  private readyCountDown = -1;

  private winnerIndex = -1;

  constructor(
    public readonly id: number,
    public readonly gameMode: string,
    public readonly ladder: boolean,
    public readonly scoreForWin: number,
  ) {
    this.ball = new Ball();
    this.players = new Map();
    this.spectators = new Map();
  }

  public get state() {
    return this.gameState;
  }

  public set state(value: GameState) {
    if (this.gameState === value) return;
    this.gameState = value;
    this.gameTime = 0;
    this.broadcast(SocketEventName.GAME_STATE_NOTIFY, <GameStateNotifyDto>{
      state: value,
    });
    if (value === GameState.READY) {
      this.ball.reset();
      this.broadcast(SocketEventName.BALL_MOVE_NOTIFY, this.ball.dto);
    } else if (value === GameState.PLAYING) {
      this.ball.begin();
      this.broadcast(SocketEventName.BALL_MOVE_NOTIFY, this.ball.dto);
    } else if (value === GameState.ENDED) {
      this.determineWinner();
      this.broadcast(SocketEventName.GAME_END_NOTIFY, <GameEndNotifyDto>{
        winnerIndex: this.winnerIndex,
      });
    }
  }

  public isFull() {
    return this.players.size > 2;
  }

  public join(user: UserContext, index: number) {
    this.players[user.id] = new Player(user, index);
  }

  public joinSpectator(user: UserContext) {
    this.spectators[user.id] = user;
  }

  public leave(user: UserContext) {
    this.players.delete(user.id);
    if (this.state !== GameState.WAITING) {
      this.state = GameState.ENDED;
    }
  }

  public leaveSpectator(user: UserContext) {
    this.spectators.delete(user.id);
  }

  public move(user: UserContext, move: PlayerMoveResDto) {
    const player = this.players.get(user.id);
    if (player) {
      player.pos.x = move.x;
      player.pos.y = move.y;
      this.broadcast(SocketEventName.PLAYER_MOVE_NOTIFY, <PlayerMoveResDto>{
        playerIndex: player.index,
        x: move.x,
        y: move.y,
      });
    }
  }

  public findIndex(user: UserContext) {
    return this.players.get(user.id)?.index || -1;
  }

  public update() {
    this.gameTime += GAME_TIME_INTERVAL;

    switch (this.state) {
      case GameState.WAITING:
        this.updateWaiting();
        break;
      case GameState.READY:
        this.updateReady();
        break;
      case GameState.PLAYING:
        this.updatePlaying();
        break;
      default:
        break;
    }
  }

  private updateWaiting() {
    if (this.players.size === 2) {
      this.state = GameState.READY;
    }
  }

  private updateReady() {
    if (this.gameTime < 4000) {
      const time = Math.floor(4000 - this.gameTime);
      if (this.readyCountDown !== time) {
        this.readyCountDown = time;
        this.broadcast(SocketEventName.GAME_READY_NOTIFY, <GameReadyNotifyDto>{
          readyCountDown: time,
        });
      }
    } else {
      this.state = GameState.PLAYING;
      this.readyCountDown = -1;
    }
  }

  private updatePlaying() {
    this.ball.update(this.getPlayers());
    this.broadcast(SocketEventName.BALL_MOVE_NOTIFY, this.ball.dto);

    if (this.ball.pos.x < 0) {
      // Right side win
      this.goal(1);
    } else if (this.ball.pos.x > GAME_SCREEN_WIDTH) {
      // Left side win
      this.goal(0);
    }
  }

  private getPlayers(): (Player | null)[] {
    const players: (Player | null)[] = [null, null];

    this.players.forEach((player) => {
      players[player.index] = player;
    });

    return players;
  }

  private goal(index: number) {
    const players = this.getPlayers();
    const player = players[index];

    if (player) {
      player.score += 1;
      if (player.score >= this.scoreForWin) {
        this.state = GameState.ENDED;
      } else {
        this.broadcast(SocketEventName.GAME_SCORE_NOTIFY, <GameScoreDto>{
          playerIndex: index,
          score: player.score,
        });
        this.state = GameState.READY;
      }
    }
  }

  private determineWinner() {
    const players = this.getPlayers();

    const leftScore = players[0]?.score || -1;
    const rightScore = players[1]?.score || -1;

    if (leftScore > rightScore) {
      this.winnerIndex = 0;
    } else if (rightScore > leftScore) {
      this.winnerIndex = 1;
    }
  }

  private broadcast(event: string, data: any, except?: UserContext) {
    this.players.forEach((player) => {
      if (player) {
        if (except && except.id === player.user.id) return;
        player.user.socket.emit(event, data);
      }
    });
    this.spectators.forEach((spectator) => {
      if (except && except.id === spectator.id) return;
      spectator.socket.emit(event, data);
    });
  }
}

import { Player } from './player.class';
import { Ball } from './ball.class';
import GameState from '../dto/constants/game.state.enum';
import { GAME_SCREEN_WIDTH } from '../dto/constants/game.constants';

export class Room {
  private player: Player[];

  private ball: Ball;

  private state: GameState = GameState.WAITING;

  constructor(private gameMode: string, private ladder: boolean) {
    this.ball = new Ball();
  }

  public update() {
    this.ball.update();

    if (this.ball.pos.x < 0) {
      // Right side win
    } else if (this.ball.pos.x > GAME_SCREEN_WIDTH) {
      // Left side win
    }
  }
}

import { UserContext } from 'src/socket/class/user.class';
import {
  GAME_SCREEN_HEIGHT,
  PLAYER_RACKET_HEIGHT,
  PLAYER_RACKET_INIT_POS,
} from '../constants/game.constants';

export class Player {
  public score = 0;

  private x: number;

  private y: number;

  constructor(
    public readonly user: UserContext,
    public readonly index: number,
  ) {
    this.reset();
  }

  public get pos() {
    return { x: this.x, y: this.y };
  }

  public set pos(pos: { x: number; y: number }) {
    const MIN = 0 + PLAYER_RACKET_HEIGHT / 2;
    const MAX = GAME_SCREEN_HEIGHT - PLAYER_RACKET_HEIGHT / 2;

    this.y = pos.y;
    if (this.y < MIN) this.y = MIN;
    if (this.y > MAX) this.y = MAX;
  }

  public reset() {
    this.x = PLAYER_RACKET_INIT_POS[this.index].x;
    this.y = PLAYER_RACKET_INIT_POS[this.index].y;
  }
}

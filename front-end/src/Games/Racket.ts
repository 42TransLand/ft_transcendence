import {
  PLAYER_RACKET_HEIGHT,
  PLAYER_RACKET_INIT_POS,
  PLAYER_RACKET_WIDTH,
} from './dto/constants/game.constants';
import GameObject from './GameObject';

export default class Racket extends GameObject {
  constructor(private index: number) {
    super(PLAYER_RACKET_INIT_POS[index].x, PLAYER_RACKET_INIT_POS[index].y);
    this.draw();
  }

  protected draw(): void {
    this.graphic
      .clear()
      .beginFill(0xffffff)
      .drawRect(
        this.pos.x,
        this.pos.y,
        PLAYER_RACKET_WIDTH,
        PLAYER_RACKET_HEIGHT,
      )
      .endFill();
    this.graphic.pivot.x = this.graphic.width / 2;
    this.graphic.pivot.y = this.graphic.height / 2;
  }
}

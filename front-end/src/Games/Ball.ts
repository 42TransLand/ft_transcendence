import * as PIXI from 'pixi.js';
import {
  GAME_SCREEN_WIDTH,
  GAME_SCREEN_HEIGHT,
  BALL_RADIUS,
} from './dto/constants/game.constants';
import BallMoveNotifyDto from './dto/res/ball.move.notify.dto';
import GameObject from './GameObject';

export default class Ball extends GameObject {
  private radius: number;

  private vel: PIXI.Point;

  public constructor() {
    super(GAME_SCREEN_WIDTH / 2, GAME_SCREEN_HEIGHT / 2);
    this.radius = BALL_RADIUS;
    this.vel = new PIXI.Point(0, 0);
  }

  public render() {
    this.draw();
  }

  public onBallMove(msg: BallMoveNotifyDto) {
    const newPos = new PIXI.Point(msg.x, msg.y);
    const newVel = new PIXI.Point(msg.vecX, msg.vecY);

    this.pos = newPos;
    this.vel = newVel;
  }

  protected draw(): void {
    this.graphic
      .clear()
      .beginFill(0xffffff)
      .drawCircle(this.pos.x, this.pos.y, this.radius)
      .endFill();
  }
}

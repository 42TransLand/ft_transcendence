import { Socket } from 'socket.io';
import BallMoveDto from '../dto/ball.dto';
import {
  GAME_SCREEN_HEIGHT,
  GAME_SCREEN_WIDTH,
  BALL_RADIUS,
} from '../dto/constants/game.constants';

export class Ball {
  private x: number = GAME_SCREEN_WIDTH / 2;

  private y: number = GAME_SCREEN_HEIGHT / 2;

  private vecX: number;

  private vecY: number;

  private radius: number = BALL_RADIUS;

  constructor() {
    this.vecX = 0;
    this.vecY = 0;
  }

  public get pos() {
    return { x: this.x, y: this.y };
  }

  public sendTo(socket: Socket) {
    const ballMoveDto: BallMoveDto = {
      x: this.x,
      y: this.y,
      vecX: this.vecX,
      vecY: this.vecY,
    };
    socket.emit('ball', ballMoveDto);
  }

  public update() {
    const newPos = { x: this.x + this.vecX, y: this.y + this.vecY };
    const boundary = {
      l: this.radius,
      r: GAME_SCREEN_WIDTH - this.radius,
      t: this.radius,
      b: GAME_SCREEN_HEIGHT - this.radius,
    };
    newPos.x += this.vecX;
    newPos.y += this.vecY;
    if (newPos.x < boundary.l) {
      newPos.x = boundary.l;
      this.vecX *= -1;
    } else if (newPos.x > boundary.r) {
      newPos.x = boundary.r;
      this.vecX *= -1;
    }
    if (newPos.y < boundary.t) {
      newPos.y = boundary.t;
      this.vecY *= -1;
    } else if (newPos.y > boundary.b) {
      newPos.y = boundary.b;
      this.vecY *= -1;
    }
  }
}

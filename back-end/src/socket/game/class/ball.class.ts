import BallMoveDto from '../dto/res/ball.move.notify.dto';
import {
  GAME_SCREEN_HEIGHT,
  GAME_SCREEN_WIDTH,
  BALL_RADIUS,
  GAME_TIME_INTERVAL,
  PLAYER_RACKET_WIDTH,
  PLAYER_RACKET_HEIGHT,
  BALL_INITIAL_SPEED,
} from '../constants/game.constants';
import BallDirection from '../constants/ball.enum';
import { Player } from './player.class';

export class Ball {
  private x: number = GAME_SCREEN_WIDTH / 2;

  private y: number = GAME_SCREEN_HEIGHT / 2;

  private vecX: number;

  private vecY: number;

  private accelation: number;

  private radius: number = BALL_RADIUS;

  constructor() {
    this.vecX = 0;
    this.vecY = 0;
    this.accelation = 0.0;
  }

  public get pos() {
    return { x: this.x, y: this.y };
  }

  public get dto() {
    return <BallMoveDto>{
      x: this.x,
      y: this.y,
      vecX: this.vecX,
      vecY: this.vecY,
    };
  }

  public reset() {
    this.x = GAME_SCREEN_WIDTH / 2;
    this.y = GAME_SCREEN_HEIGHT / 2;
    this.vecX = 0;
    this.vecY = 0;
  }

  public begin() {
    const initAngle =
      Math.round(Math.random()) * Math.PI +
      ((Math.random() * Math.PI) / 3 - Math.PI / 6);

    this.vecX = Math.cos(initAngle) * BALL_INITIAL_SPEED;
    this.vecY = Math.sin(initAngle) * BALL_INITIAL_SPEED;

    console.log(`Ball init vector: ${this.vecX}, ${this.vecY}`);
  }

  public update(players: (Player | null)[]) {
    const newPos = { x: this.x, y: this.y };
    const boundary = {
      l: this.radius,
      r: GAME_SCREEN_WIDTH - this.radius,
      t: this.radius,
      b: GAME_SCREEN_HEIGHT - this.radius,
    };
    const delta = GAME_TIME_INTERVAL / 1000;

    // 가속도
    // ref: http://zonalandeducation.com/mstm/physics/mechanics/kinematics/EquationsForAcceleratedMotion/EquationsForAcceleratedMotion.htm
    // d = v0 * t + 1/2 * a * t^2
    newPos.x = newPos.x + this.vecX + (this.accelation * delta * delta) / 2;
    newPos.y = newPos.y + this.vecY + (this.accelation * delta * delta) / 2;
    this.vecX += this.accelation * delta * Math.sign(this.vecX);
    this.vecY += this.accelation * delta * Math.sign(this.vecY);

    const deltaX = newPos.x - this.x;
    const deltaY = newPos.y - this.y;

    // 벽 충돌처리
    if (newPos.y < boundary.t) {
      newPos.y = boundary.t;
      this.vecY *= -1;
    } else if (newPos.y > boundary.b) {
      newPos.y = boundary.b;
      this.vecY *= -1;
    }

    const player = this.vecX < 0 ? players[0] : players[1];
    if (player) {
      const intersect = this.intersect(player, deltaX, deltaY);
      if (intersect) {
        newPos.x = intersect.x;
        this.vecX *= -1;
      }
    }

    this.x = newPos.x;
    this.y = newPos.y;
  }

  // 선분교차
  // ref: https://gaussian37.github.io/math-algorithm-line_intersection/
  // https://jordano-jackson.tistory.com/27
  // https://sncap.tistory.com/910
  private intersect(player: Player, deltaX: number, deltaY: number) {
    const x1 = this.x;
    const y1 = this.y;
    const x2 = this.x + deltaX;
    const y2 = this.y + deltaY;

    const direction = deltaX < 0 ? BallDirection.LEFT : BallDirection.RIGHT;

    let x3: number;
    let y3: number;
    let x4: number;
    let y4: number;

    switch (direction) {
      case BallDirection.LEFT:
        x3 = player.pos.x + PLAYER_RACKET_WIDTH / 2 + this.radius; // rt.x
        x4 = player.pos.x + PLAYER_RACKET_WIDTH / 2 + this.radius; // rb.x
        y3 = player.pos.y - PLAYER_RACKET_HEIGHT / 2 - this.radius; // rt.y
        y4 = player.pos.y + PLAYER_RACKET_HEIGHT / 2 + this.radius; // rb.y
        break;
      case BallDirection.RIGHT:
        x3 = player.pos.x - PLAYER_RACKET_WIDTH / 2 - this.radius; // lt.x
        x4 = player.pos.x - PLAYER_RACKET_WIDTH / 2 - this.radius; // lb.x
        y3 = player.pos.y - PLAYER_RACKET_HEIGHT / 2 - this.radius; // lt.y
        y4 = player.pos.y + PLAYER_RACKET_HEIGHT / 2 + this.radius; // lb.y
        break;
      default:
        throw new Error();
    }

    // if (nx < 0) {
    //   pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny,
    //                              rect.right  + ball.radius,
    //                              rect.top    - ball.radius,
    //                              rect.right  + ball.radius,
    //                              rect.bottom + ball.radius,
    //                              "right");
    // }
    // else if (nx > 0) {
    //   pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny,
    //                              rect.left   - ball.radius,
    //                              rect.top    - ball.radius,
    //                              rect.left   - ball.radius,
    //                              rect.bottom + ball.radius,
    //                              "left");
    // }

    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom !== 0) {
      const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
      if (ua >= 0 && ua <= 1) {
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
        if (ub >= 0 && ub <= 1) {
          const x = x1 + ua * (x2 - x1);
          const y = y1 + ua * (y2 - y1);
          return { x, y, direction };
        }
      }
    }
    return null;

    // const a = playerEndY - playerBeginY;
    // const b = playerBeginX - playerEndX;
    // const e = a * playerBeginX + b * playerBeginY;

    // const c = ballNewY - ballY;
    // const d = ballX - ballNewX;
    // const f = c * ballX + d * ballY;

    // const denom = a * d - b * c;
    // if (denom === 0) {
    //   return null;
    // }

    // let x = (e * d - b * f) / denom;

    // if (deltaX < 0) {
    //   if (x < playerBeginX) x = playerBeginX;
    // } else if (deltaX > 0) {
    //   if (x > playerBeginX) x = playerBeginX;
    // }
    // return { x, direction };

    // const denom =
    //   (playerEndY - playerBeginY) * (ballNewX - ballX) -
    //   (playerEndX - playerBeginX) * (ballNewY - ballY);
    // if (denom === 0) {
    //   return null;
    // }
    // const ua =
    //   ((playerEndX - playerBeginX) * (ballY - playerBeginY) -
    //     (playerEndY - playerBeginY) * (ballX - playerBeginX)) /
    //   denom;
    // if (ua < 0 || ua > 1) {
    //   return null;
    // }
    // const ub =
    //   ((ballNewX - ballX) * (ballY - playerBeginY) -
    //     (ballNewY - ballY) * (ballX - playerBeginX)) /
    //   denom;
    // if (ub < 0 || ub > 1) {
    //   return null;
    // }

    // const x = ballX + ua * (ballNewX - ballX);
    // const y = ballY + ua * (ballNewY - ballY);
    // return { x, y, direction };
  }
}

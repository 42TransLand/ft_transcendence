import BallMoveDto from '../dto/res/ball.move.notify.dto';
import {
  GAME_SCREEN_HEIGHT,
  GAME_SCREEN_WIDTH,
  BALL_RADIUS,
  GAME_TIME_INTERVAL,
  PLAYER_RACKET_WIDTH,
  PLAYER_RACKET_HEIGHT,
  BALL_INITIAL_SPEED,
  GAME_SCREEN_UNIT,
  BALL_DEFAULT_ACCELATION,
} from '../constants/game.constants';
import BallDirection from '../constants/ball.enum';
import { Player } from './player.class';
import { GameMode } from 'src/game/constants/game.mode.enum';

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
    this.accelation = BALL_DEFAULT_ACCELATION;
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

  public begin(mode: GameMode) {
    const initAngle =
      Math.round(Math.random()) * Math.PI +
      ((Math.random() * Math.PI) / 3 - Math.PI / 6);
    if (mode === 'CLASSIC') {
      this.vecX = Math.cos(initAngle) * BALL_INITIAL_SPEED;
      this.vecY = Math.sin(initAngle) * BALL_INITIAL_SPEED;
    } else if (mode === 'SPEED') {
      this.vecX = Math.cos(initAngle) * BALL_INITIAL_SPEED * 1.5;
      this.vecY = Math.sin(initAngle) * BALL_INITIAL_SPEED * 1.5;
    }
  }

  public update(players: (Player | null)[]) {
    const newPos = { x: this.x, y: this.y };
    const boundary = {
      l: 0,
      r: GAME_SCREEN_WIDTH,
      t: GAME_SCREEN_UNIT + this.radius,
      b: GAME_SCREEN_HEIGHT - GAME_SCREEN_UNIT - this.radius,
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

        const xDirection = Math.sign(-this.vecX);
        let yDirection = Math.sign(-this.vecY || intersect.yNormalized);
        const vecLen = Math.sqrt(this.vecX * this.vecX + this.vecY * this.vecY);
        const abs = Math.abs(intersect.yNormalized);
        const threshold = 0.5;
        let angle: number | undefined;
        if (abs < threshold) {
          // 정면으로 맞은 것으로 취급 -> 입사각 = 반사각.
          // 그러나, 입사각이 30도를 초과할 경우, 반사각은 30도로 조정.
          if (Math.atan2(this.vecY, this.vecX) > Math.PI / 6) {
            angle = Math.PI / 6;
          } else {
            this.vecX *= -1;
          }
        } else {
          // 끄트머리는 (threshold * 60D) ~ 60D
          angle = (abs * Math.PI) / 3;
          yDirection *= 1;
        }
        if (angle !== undefined) {
          this.vecX = vecLen * Math.cos(angle) * xDirection;
          this.vecY = vecLen * -Math.sin(angle) * yDirection;
        }
      }
    }

    this.x = newPos.x;
    this.y = newPos.y;
  }

  private intersect(player: Player, deltaX: number, deltaY: number) {
    // x1, y1 은 현재 공의 좌표
    const x1 = this.x;
    const y1 = this.y;

    // x2, y2 는 새로운 공의 좌표
    const x2 = this.x + deltaX;
    const y2 = this.y + deltaY;

    // 공의 방향
    const direction = deltaX < 0 ? BallDirection.LEFT : BallDirection.RIGHT;

    let lineX: number;
    let y3: number;
    let y4: number;

    switch (direction) {
      case BallDirection.LEFT:
        lineX = player.pos.x + PLAYER_RACKET_WIDTH / 2 + this.radius; // rt.x
        y3 = player.pos.y - PLAYER_RACKET_HEIGHT / 2 - this.radius; // rt.y
        y4 = player.pos.y + PLAYER_RACKET_HEIGHT / 2 + this.radius; // rb.y
        if (x1 <= lineX || x2 > lineX) {
          return null;
        }
        break;
      case BallDirection.RIGHT:
        lineX = player.pos.x - PLAYER_RACKET_WIDTH / 2 - this.radius; // lt.x
        y3 = player.pos.y - PLAYER_RACKET_HEIGHT / 2 - this.radius; // lt.y
        y4 = player.pos.y + PLAYER_RACKET_HEIGHT / 2 + this.radius; // lb.y
        if (x1 >= lineX || x2 < lineX) {
          return null;
        }
        break;
      default:
        throw new Error();
    }

    const d = (y2 - y1) / (x2 - x1);
    const yHit = d * (lineX - x1) + y1;
    if (yHit < y3 || yHit > y4) {
      return null;
    }
    const xBounced = 2 * lineX - x2;
    const yNormalized = ((yHit - y3) / (y4 - y3)) * 2 - 1;

    return { x: xBounced, yNormalized, direction };
  }
}

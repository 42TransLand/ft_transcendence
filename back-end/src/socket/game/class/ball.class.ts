import BallMoveDto from '../dto/res/ball.move.notify.dto';
import {
  GAME_SCREEN_HEIGHT,
  GAME_SCREEN_WIDTH,
  BALL_RADIUS,
  GAME_TIME_INTERVAL,
  PLAYER_RACKET_WIDTH,
  PLAYER_RACKET_HEIGHT,
  BALL_INITIAL_SPEED,
} from '../dto/constants/game.constants';
import BallDirection from './ball.enum';
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
    const dirX = Math.random() / 2 + 0.25; // 0.25 ~ 0.75
    const dirY = 1 - dirX;

    this.vecX = dirX * BALL_INITIAL_SPEED;
    this.vecY = dirY * BALL_INITIAL_SPEED;
  }

  public update(players: (Player | null)[]) {
    const newPos = { x: this.x, y: this.y };
    const boundary = {
      l: this.radius,
      r: GAME_SCREEN_WIDTH - this.radius,
      t: this.radius,
      b: GAME_SCREEN_HEIGHT - this.radius,
    };

    // 가속도
    // ref: http://zonalandeducation.com/mstm/physics/mechanics/kinematics/EquationsForAcceleratedMotion/EquationsForAcceleratedMotion.htm
    // d = v0 * t + 1/2 * a * t^2
    newPos.x =
      newPos.x +
      GAME_TIME_INTERVAL * this.vecX +
      (this.accelation * GAME_TIME_INTERVAL * GAME_TIME_INTERVAL) / 2;
    newPos.y =
      newPos.y +
      GAME_TIME_INTERVAL * this.vecY +
      (this.accelation * GAME_TIME_INTERVAL * GAME_TIME_INTERVAL) / 2;
    this.vecX += this.accelation * GAME_TIME_INTERVAL * Math.sign(this.vecX);
    this.vecY += this.accelation * GAME_TIME_INTERVAL * Math.sign(this.vecY);

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
    const ballX = this.x;
    const ballY = this.y;
    const ballNewX = this.x + deltaX;
    const ballNewY = this.y + deltaY;

    const direction = deltaX < 0 ? BallDirection.LEFT : BallDirection.RIGHT;

    let playerBeginX: number;
    let playerBeginY: number;
    let playerEndX: number;
    let playerEndY: number;

    switch (direction) {
      case BallDirection.LEFT:
        playerBeginX = player.pos.x - PLAYER_RACKET_WIDTH / 2 - this.radius;
        playerBeginY = player.pos.y - PLAYER_RACKET_HEIGHT / 2 - this.radius;
        playerEndX = player.pos.x - PLAYER_RACKET_WIDTH / 2 - this.radius;
        playerEndY = player.pos.y - PLAYER_RACKET_HEIGHT / 2 + this.radius;
        break;
      case BallDirection.RIGHT:
        playerBeginX = player.pos.x + PLAYER_RACKET_WIDTH / 2 + this.radius;
        playerBeginY = player.pos.y + PLAYER_RACKET_HEIGHT / 2 - this.radius;
        playerEndX = player.pos.x + PLAYER_RACKET_WIDTH / 2 + this.radius;
        playerEndY = player.pos.y + PLAYER_RACKET_HEIGHT / 2 + this.radius;
        break;
      default:
        throw new Error();
    }

    const a = playerEndY - playerBeginY;
    const b = playerBeginX - playerEndX;
    const e = a * playerBeginX + b * playerBeginY;

    const c = ballNewY - ballY;
    const d = ballX - ballNewX;
    const f = c * ballX + d * ballY;

    const denom = a * d - b * c;
    if (denom === 0) {
      return null;
    }

    let x = (e * d - b * f) / denom;

    if (deltaX < 0) {
      if (x < playerBeginX) x = playerBeginX;
    } else if (deltaX > 0) {
      if (x > playerBeginX) x = playerBeginX;
    }

    /*
    const x = ballX + ua * (ballNewX - ballX);
    const y = ballY + ua * (ballNewY - ballY);
    return { x, y, direction };

    const denom =
      (playerEndY - playerBeginY) * (ballNewX - ballX) -
      (playerEndX - playerBeginX) * (ballNewY - ballY);
    if (denom === 0) {
      return null;
    }
    const ua =
      ((playerEndX - playerBeginX) * (ballY - playerBeginY) -
        (playerEndY - playerBeginY) * (ballX - playerBeginX)) /
      denom;
    if (ua < 0 || ua > 1) {
      return null;
    }
    const ub =
      ((ballNewX - ballX) * (ballY - playerBeginY) -
        (ballNewY - ballY) * (ballX - playerBeginX)) /
      denom;
    if (ub < 0 || ub > 1) {
      return null;
    }

    const x = ballX + ua * (ballNewX - ballX);
    const y = ballY + ua * (ballNewY - ballY);
    return { x, y, direction };
    */

    return { x, direction };
  }
}

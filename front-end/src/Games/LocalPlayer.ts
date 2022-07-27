import * as PIXI from 'pixi.js';
import { Socket } from 'socket.io-client';
import {
  PLAYER_RACKET_MOVE_SPEED,
  PLAYER_RACKET_HEIGHT,
  GAME_SCREEN_HEIGHT,
  SocketEventName,
} from './dto/constants/game.constants';
import InputManager from './InputManager';
import AbstractPlayer from './AbstractPlayer';

export default class LocalPlayer extends AbstractPlayer {
  public constructor(
    private input: InputManager,
    private socket: Socket,
    index: number,
  ) {
    super(index);
  }

  public update(delta: number) {
    const { mouseDelta } = this.input;
    const keyboardDelta = new PIXI.Point(0, 0);

    if (this.input.isDown('w') || this.input.isDown('ArrowUp')) {
      keyboardDelta.y -= delta * PLAYER_RACKET_MOVE_SPEED;
    } else if (this.input.isDown('s') || this.input.isDown('ArrowDown')) {
      keyboardDelta.y += delta * PLAYER_RACKET_MOVE_SPEED;
    }

    // eslint-disable-next-line no-console
    if (this.socket.connected)
      this.onLocalMove(this.socket, mouseDelta, keyboardDelta);
  }

  private onLocalMove(
    socket: Socket,
    mouseDelta: PIXI.IPointData,
    keyboardDelta: PIXI.IPointData,
  ) {
    const MIN = 0 + PLAYER_RACKET_HEIGHT / 2;
    const MAX = GAME_SCREEN_HEIGHT - PLAYER_RACKET_HEIGHT / 2;
    const oldPos = this.racket.pos;

    const newPos = new PIXI.Point(
      oldPos.x,
      oldPos.y + (mouseDelta.y + keyboardDelta.y),
    );

    if (newPos.y < MIN) newPos.y = MIN;
    if (newPos.y > MAX) newPos.y = MAX;

    if (this.racket.pos.x !== newPos.x || this.racket.pos.y !== newPos.y) {
      this.racket.pos = newPos;
      socket.emit(SocketEventName.PLAYER_MOVE_REQ, {
        playerIndex: this.index,
        x: newPos.x,
        y: newPos.y,
      });
    }
  }
}

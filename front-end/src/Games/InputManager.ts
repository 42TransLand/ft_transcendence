/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   InputManager.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: smun <smun@student.42seoul.kr>             +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/07/01 09:26:57 by smun              #+#    #+#             */
/*   Updated: 2022/07/29 15:16:16 by smun             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Point } from 'pixi.js';

class InputManager {
  private readonly mouseTracker: HTMLElement;

  private keys: { [key: string]: boolean };

  private prevPos: Point = new Point(-1, -1);

  private curPos: Point = new Point(0, 0);

  private movement: Point = new Point(0, 0);

  private touching: boolean = false;

  constructor(mouseTracker: HTMLElement) {
    this.mouseTracker = mouseTracker;
    this.requestPointerLock = this.requestPointerLock.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.onPointerLockChange = this.onPointerLockChange.bind(this);
    this.keys = {};
    this.isDown = this.isDown.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.update = this.update.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchCancel = this.onTouchCancel.bind(this);
  }

  public isDown(keyCode: string): boolean {
    return this.keys[keyCode] || false;
  }

  public onKeyDown(event: KeyboardEvent) {
    if (event.repeat) return;
    this.keys[event.key] = true;
  }

  public onKeyUp(event: KeyboardEvent) {
    if (event.repeat) return;
    this.keys[event.key] = false;
  }

  public get mouseDelta(): Point {
    return this.movement.clone();
  }

  public onComponentDidMount() {
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    document.addEventListener('touchstart', this.onTouchStart, {
      passive: false,
    });
    document.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });
    document.addEventListener('touchend', this.onTouchEnd);
    document.addEventListener('touchcancel', this.onTouchCancel);
  }

  public onComponentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('touchcancel', this.onTouchCancel);
  }

  public requestPointerLock(): void {
    this.mouseTracker.requestPointerLock();
  }

  public update(): void {
    this.movement = new Point(
      this.curPos.x - this.prevPos.x,
      this.curPos.y - this.prevPos.y,
    );
    this.prevPos = this.curPos;
  }

  private onPointerLockChange(): void {
    if (document.pointerLockElement === this.mouseTracker) {
      // eslint-disable-next-line no-console
      console.log('The pointer lock status is now locked');
      document.addEventListener('mousemove', this.updatePosition, false);
    } else {
      // eslint-disable-next-line no-console
      console.log('The pointer lock status is now unlocked');
      document.removeEventListener('mousemove', this.updatePosition, false);
    }
  }

  private updatePosition(e: MouseEvent): void {
    this.curPos = new Point(
      this.curPos.x + e.movementX,
      this.curPos.y + e.movementY,
    );
    if (this.prevPos.x === -1 && this.prevPos.y === -1) {
      this.prevPos = this.curPos;
    }
  }

  private onTouchStart(e: TouchEvent): void {
    const elementScreenRatio =
      window.screen.height / this.mouseTracker.offsetHeight;
    e.preventDefault();
    this.touching = true;
    this.curPos = new Point(
      e.changedTouches[0].screenX * elementScreenRatio,
      e.changedTouches[0].screenY * elementScreenRatio,
    );
    this.prevPos = this.curPos;
  }

  private onTouchMove(e: TouchEvent): void {
    const elementScreenRatio =
      window.screen.height / this.mouseTracker.offsetHeight;
    e.preventDefault();
    if (!this.touching) return;
    if (e.touches.length === 0) return;
    this.curPos = new Point(
      e.changedTouches[0].screenX * elementScreenRatio,
      e.changedTouches[0].screenY * elementScreenRatio,
    );
    if (this.prevPos.x === -1 && this.prevPos.y === -1) {
      this.prevPos = this.curPos;
    }
  }

  private onTouchEnd(e: TouchEvent): void {
    e.preventDefault();
    this.touching = false;
  }

  private onTouchCancel(e: TouchEvent): void {
    e.preventDefault();
    this.touching = false;
  }
}

export default InputManager;

/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   InputManager.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: smun <smun@student.42seoul.kr>             +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/07/01 09:26:57 by smun              #+#    #+#             */
/*   Updated: 2022/07/25 15:27:47 by smun             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Point } from 'pixi.js';

class InputManager {
  private readonly mouseTracker: HTMLElement;

  private keys: { [key: string]: boolean };

  private prevPos: Point = new Point(-1, -1);

  private curPos: Point = new Point(0, 0);

  private movement: Point = new Point(0, 0);

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
  }

  public onComponentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
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
}

export default InputManager;

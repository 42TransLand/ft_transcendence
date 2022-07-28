import { DisplayObject, Graphics, Point } from 'pixi.js';

abstract class GameObject {
  protected readonly graphic: Graphics;

  private playerPos: Point;

  public constructor(x: number, y: number) {
    this.playerPos = new Point(x, y);
    this.graphic = new Graphics();
  }

  public get pos(): Point {
    return this.playerPos;
  }

  public set pos(newPos: Point) {
    this.playerPos = newPos;
    this.draw();
  }

  public undraw(): void {
    this.graphic.clear();
  }

  protected abstract draw(): void;

  public get displayObject(): DisplayObject {
    return this.graphic;
  }
}

export default GameObject;

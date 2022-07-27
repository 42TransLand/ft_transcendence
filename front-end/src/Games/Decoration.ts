import GameObject from './GameObject';

export default class Decoration extends GameObject {
  constructor(
    x: number,
    y: number,
    private width: number,
    private height: number,
    private pivotX: number,
    private pivotY: number,
  ) {
    super(x, y);
  }

  public render(): void {
    this.draw();
  }

  protected draw(): void {
    this.graphic
      .clear()
      .beginFill(0xffffff)
      .drawRect(this.pos.x, this.pos.y, this.width, this.height)
      .endFill();
    this.graphic.pivot.x = this.graphic.width * this.pivotX;
    this.graphic.pivot.y = this.graphic.height * this.pivotY;
  }
}

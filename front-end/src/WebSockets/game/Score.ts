import * as PIXI from 'pixi.js';
import {
  PLAYER_SCORE_POS,
  PLAYER_SCORE_FONT_STYLE,
  PLAYER_SCORE_PIVOT,
} from '../dto/constants/game.constants';
import GameObject from './GameObject';

export default class Score extends GameObject {
  private text: PIXI.Text;

  constructor(private index: number) {
    super(PLAYER_SCORE_POS[index].x, PLAYER_SCORE_POS[index].y);
    this.text = new PIXI.Text('^', new PIXI.TextStyle(PLAYER_SCORE_FONT_STYLE));
    this.draw();
  }

  public set number(number: number) {
    this.content = number.toString();
  }

  public set content(text: string) {
    this.text.text = text;
    this.draw();
  }

  public override get displayObject(): PIXI.DisplayObject {
    return this.text;
  }

  public override undraw(): void {
    this.text.text = '';
  }

  protected draw(): void {
    this.text.position = this.pos;
    this.text.anchor.x = PLAYER_SCORE_PIVOT[this.index].x;
    this.text.anchor.y = PLAYER_SCORE_PIVOT[this.index].y;
  }
}

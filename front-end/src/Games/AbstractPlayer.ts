import * as PIXI from 'pixi.js';
import GameScoreNotifyDto from './dto/res/game.score.notify.dto';
import PlayerMoveNotifyDto from './dto/res/player.move.notify.dto';
import Racket from './Racket';
import Score from './Score';

abstract class AbstractPlayer {
  protected racket: Racket;

  protected score: Score;

  protected constructor(protected index: number) {
    this.racket = new Racket(index);
    this.score = new Score(index);
    this.update = this.update.bind(this);
  }

  public onMove(msg: PlayerMoveNotifyDto) {
    this.racket.pos = new PIXI.Point(msg.x, msg.y);
  }

  public onScore(msg: GameScoreNotifyDto) {
    this.score.number = msg.score;
  }

  public abstract update(delta: number): void;

  public undraw() {
    this.racket.undraw();
    this.score.undraw();
  }

  public get displayObjects(): PIXI.DisplayObject[] {
    return [this.racket.displayObject, this.score.displayObject];
  }
}

export default AbstractPlayer;

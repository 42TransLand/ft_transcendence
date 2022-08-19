import BaseResultDto from '../base.result.dto';
import GameMode from '../constants/game.mode.enum';

export default interface GameCreateResDto extends BaseResultDto {
  gameMode: GameMode;
  ladder: boolean;
  scoreForWin: number;
  myIndex: number;
}

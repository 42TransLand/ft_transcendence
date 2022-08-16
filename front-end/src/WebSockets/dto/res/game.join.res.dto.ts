import GameMode from '../constants/game.mode.enum';
import BaseResultDto from '../base.result.dto';

export default interface GameJoinResDto extends BaseResultDto {
  gameMode: GameMode;
  ladder: boolean;
  scoreForWin: number;
  myIndex: number;
}

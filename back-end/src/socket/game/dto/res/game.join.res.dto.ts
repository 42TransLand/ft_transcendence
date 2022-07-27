import BaseResultDto from '../base.result.dto';

export default interface GameJoinResDto extends BaseResultDto {
  gameMode: string;
  ladder: boolean;
  scoreForWin: number;
  myIndex: number;
}

import GameMatchDto from './game.match.dto';

export default interface GameInviteDto extends GameMatchDto {
  scoreForWin: number;
}

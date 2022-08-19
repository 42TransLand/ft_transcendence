import GameMode from '../constants/game.mode.enum';

export default interface GameMatchDto {
  gameMode: GameMode;
  opponentNickname: string;
}

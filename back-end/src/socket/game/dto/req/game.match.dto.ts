import { GameMode } from 'src/game/constants/game.mode.enum';

export default interface GameMatchDto {
  gameMode: GameMode;
  opponentNickname: string;
}

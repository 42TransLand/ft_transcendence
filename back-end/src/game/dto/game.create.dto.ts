import { GameMode } from '../constants/game.mode.enum';

export class GameCreateDto {
  leftUser: string;

  rightUser: string;

  type: GameMode;
}

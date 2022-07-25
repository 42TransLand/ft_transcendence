import { GameMode } from '../constants/game.mode.enum';

export class GameRecodDto {
  leftUser: number;

  rightUser: number;

  leftUserScore: number;

  rightUserScore: number;

  result: number;

  type: GameMode;
}

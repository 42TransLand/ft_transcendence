import { GameMode } from 'src/game/constants/game.mode.enum';

export default class GameReservation {
  public readonly createdAt: Date = new Date();

  constructor(
    public readonly gameMode: GameMode,
    public readonly scoreForWin: number,
  ) {}
}

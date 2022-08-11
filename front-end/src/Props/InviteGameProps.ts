import GameMode from '../Games/dto/constants/game.mode.enum';

export default interface InviteGameProps {
  mode: GameMode;
  scoreForWin: number;
}

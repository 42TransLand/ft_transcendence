import GameMode from '../WebSockets/dto/constants/game.mode.enum';

export default interface InviteGameProps {
  mode: GameMode;
  scoreForWin: number;
}

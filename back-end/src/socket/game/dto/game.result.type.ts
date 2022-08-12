import { GameMode } from 'src/game/constants/game.mode.enum';
import { User } from 'src/users/entities/user.entity';

export type GameResult = {
  gameId: string;
  winUser: User;
  loseUser: User;
  winScore: number;
  loseScore: number;
  isLadder: boolean;
  type: GameMode;
};

import { CustomRepository } from '../custom/typeorm.decorator';
import { Repository } from 'typeorm';
import { GameRecodDto } from './dto/game.recode.dto';
import { GameMode } from './constants/game.mode.enum';
import { GameRecord } from './entities/game.entity';

@CustomRepository(GameRecord)
export class GameRepository extends Repository<GameRecord> {
  async createGame(gameRecodDto: GameRecodDto): Promise<void> {
    const { leftUser, rightUser, leftUserScore, rightUserScore, result, type } =
      gameRecodDto;
    const game = this.create({
      leftUser,
      rightUser,
      leftUserScore,
      rightUserScore,
      result,
      type, // : gameMode.LADDER_GAME
    });
    await this.save(game);
  }
}

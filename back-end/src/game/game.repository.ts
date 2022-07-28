import { CustomRepository } from '../custom/typeorm.decorator';
import { Repository } from 'typeorm';
import { GameCreateDto } from './dto/game.create.dto';
import { GameMode } from './constants/game.mode.enum';
import { GameRecord } from './entities/game.entity';
import { User } from 'src/users/entities/user.entity';

@CustomRepository(GameRecord)
export class GameRepository extends Repository<GameRecord> {
  // 게임 create, 유저 2명 일때
  async createGameTwo(leftUser: User, rightUser: User): Promise<string> {
    const game = await this.create({
      leftUser: leftUser.id,
      rightUser: rightUser.id,
      type: GameMode.LADDER_GAME, // : gameMode.LADDER_GAME
    });
    await this.save(game);
    return game.id;
  }

  // 게임 create, 유저 1명 일때
  async createGameOne(leftUser: User): Promise<string> {
    const game = await this.create({
      leftUser: leftUser.id,
      rightUser: null,
      type: GameMode.LADDER_GAME, // : gameMode.LADDER_GAME
    });
    await this.save(game);
    return game.id;
  }
}

import { CustomRepository } from '../custom/typeorm.decorator';
import { Repository } from 'typeorm';
import { GameMode } from './constants/game.mode.enum';
import { GameRecord } from './entities/game.entity';
import { User } from 'src/users/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

@CustomRepository(GameRecord)
export class GameRepository extends Repository<GameRecord> {
  // 게임 create, 유저 2명 일때
  async createGame(
    leftUser: User,
    rightUser: User,
    gameMode: GameMode,
    ladder: boolean,
  ): Promise<string> {
    const game = await this.create({
      leftUser: leftUser.id,
      rightUser: rightUser.id,
      type: gameMode, // : gameMode.LADDER_GAME
      isLadder: ladder,
    });
    try {
      await this.save(game);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return game.id;
  }
}

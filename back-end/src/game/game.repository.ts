import { CustomRepository } from '../custom/typeorm.decorator';
import { Repository } from 'typeorm';
import { GameMode } from './constants/game.mode.enum';
import { GameRecord } from './entities/game.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GameResult } from 'src/socket/game/dto/game.result.type';

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
      winUser: leftUser,
      loseUser: rightUser,
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

  async updateGame(gameResult: GameResult): Promise<void> {
    const game = await this.findOne({
      where: { id: gameResult.gameId },
    });
    if (!game) {
      throw new BadRequestException([`만들어 지지 않은 게임방입니다.`]);
    }
    game.winUser = gameResult.winUser;
    game.loseUser = gameResult.loseUser;
    game.winUserScore = gameResult.winScore;
    game.loseUserScore = gameResult.loseScore;
    game.isLadder = gameResult.isLadder;
    game.type = gameResult.type;
    try {
      await this.save(game);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getGamesByUserId(user: User): Promise<GameRecord[]> {
    const query = this.createQueryBuilder('game');

    query
      .where('game.windUserId = :userId', { userId: user.id })
      .orWhere('game.loseUserId = :userId', { userId: user.id });

    const boards = await query.getMany();

    return boards;
  }
}

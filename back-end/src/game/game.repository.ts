import { CustomRepository } from '../custom/typeorm.decorator';
import { Repository } from 'typeorm';
import { GameMode } from './constants/game.mode.enum';
import { GameRecord } from './entities/game.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

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

  async updateGame(
    gameId: string,
    winUser: User,
    loseUser: User,
    winScore: number,
    loseScore: number,
    isLadder: boolean,
    type: GameMode,
  ): Promise<void> {
    const game = await this.findOne({
      where: { id: gameId },
    });
    if (!game) {
      throw new BadRequestException([`만들어 지지 않은 게임방입니다.`]);
    }
    game.winUser = winUser;
    game.loseUser = loseUser;
    game.winUserScore = winScore;
    game.loseUserScore = loseScore;
    game.isLadder = isLadder;
    game.type = type;
    try {
      await this.save(game);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

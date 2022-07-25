import { Injectable } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRecodDto } from './dto/game.recode.dto';
import { UserDto } from 'src/users/dto/userdto';
import { GameRecord } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameRepository)
    private gameRepository: GameRepository,
  ) {}

  async createGame(gameRecodDto: GameRecodDto): Promise<void> {
    return this.gameRepository.createGame(gameRecodDto);
  }

  async getGamesByUserId(user: UserDto): Promise<GameRecord[]> {
    const query = this.gameRepository.createQueryBuilder('game');

    query
      .where('game.leftUserId = :userId', { userId: user.id })
      .orWhere('game.rightUserId = :userId', { userId: user.id });

    const boards = await query.getMany();
    return boards;
  }
}

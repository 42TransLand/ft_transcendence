import { Injectable } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GameCreateDto } from './dto/game.create.dto';
import { UserDto } from 'src/users/dto/userdto';
import { GameRecord } from './entities/game.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameRepository)
    private gameRepository: GameRepository,
    private userService: UsersService,
  ) {}

  // 유저 2명 모두 들어올 때, return gameId
  async createGame(gameCreateDto: GameCreateDto): Promise<string> {
    const { leftUser, rightUser } = gameCreateDto;

    const findLeftUser = await this.userService.findByNickname(leftUser);
    // 유저가 존재하지 않으면, null 반환하게 해야 하는데 그냥 임의로 찾아버림. friend에서는 되는데 여기서는 안됨.
    if (rightUser !== undefined) {
      const findRightUser = await this.userService.findByNickname(rightUser);
      return this.gameRepository.createGame(findLeftUser, findRightUser);
    }

    return this.gameRepository.createGame(findLeftUser);
  }

  // 프로필에서 유저의 게임 전적 가져오기
  async getGamesByUserId(user: UserDto): Promise<GameRecord[]> {
    const query = this.gameRepository.createQueryBuilder('game');

    query
      .where('game.leftUserId = :userId', { userId: user.id })
      .orWhere('game.rightUserId = :userId', { userId: user.id });

    const boards = await query.getMany();
    return boards;
  }
}

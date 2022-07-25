import { Controller, Post, Body, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { GameRecodDto } from './dto/game.recode.dto';
import { UserDto } from 'src/users/dto/userdto';
import { GameRecord } from './entities/game.entity';

@Controller('games')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  createGame(@Body() gameRecodDto: GameRecodDto): Promise<void> {
    return this.gameService.createGame(gameRecodDto);
  }

  @Get()
  getGamesByUserId(@Body() user: UserDto): Promise<GameRecord[]> {
    return this.gameService.getGamesByUserId(user);
  }
}

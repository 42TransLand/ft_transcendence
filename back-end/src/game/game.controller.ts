import { Controller, Post, Body, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { GameCreateDto } from './dto/game.create.dto';
import { UserDto } from 'src/users/dto/userdto';
import { GameRecord } from './entities/game.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Game')
@Controller('games')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  getGamesByUserId(@Body() user: UserDto): Promise<GameRecord[]> {
    return this.gameService.getGamesByUserId(user);
  }
}

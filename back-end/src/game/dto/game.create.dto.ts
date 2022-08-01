import { ApiProperty } from '@nestjs/swagger';
import { GameMode } from '../constants/game.mode.enum';

export class GameCreateDto {
  @ApiProperty({
    example: 'dcho',
    description: '왼쪽 유저의 닉네임',
  })
  leftUser: string;

  @ApiProperty({
    example: 'plee',
    description: '오른쪽 유저의 닉네임',
  })
  rightUser: string;

  @ApiProperty({
    example: GameMode.LADDER_GAME,
    description: '게임 모드',
  })
  type: GameMode;
}

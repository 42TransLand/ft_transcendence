import { ApiProperty } from '@nestjs/swagger';

export class GameUpdateDto {
  @ApiProperty({
    example: '1234',
    description: '게임 고유 아이디',
  })
  gameId: string;

  @ApiProperty({
    example: 5,
    description: '왼쪽 유저의 점수',
  })
  leftUserScore: number;

  @ApiProperty({
    example: 10,
    description: '오른쪽 유저의 점수',
  })
  rightUserScore: number;

  @ApiProperty({
    example: 1,
    description: '왼쪽 유저의 승패 여부 (0: 패, 1: 승)',
  })
  result: number;
}

import { ApiProperty } from '@nestjs/swagger';

export class GameSpectateReqDto {
  @ApiProperty({
    example: 'dcho',
    description: '관전 요청 대상 유저 닉네임',
  })
  nickname: string;
}

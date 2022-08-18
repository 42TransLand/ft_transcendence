import { ApiProperty } from '@nestjs/swagger';

export class GameSpectateResDto {
  @ApiProperty({
    example: true,
    description: '관전 요청 수락',
  })
  success: boolean;

  @ApiProperty({
    description: '에러 메세지',
  })
  error?: string;
}

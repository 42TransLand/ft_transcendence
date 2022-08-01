import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    example: 1,
    description: '사용자의 id',
  })
  id: number;

  @ApiProperty({
    example: 'dcho',
    description: '사용자의 닉네임',
  })
  nickname: string;
}

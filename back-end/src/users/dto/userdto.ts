import { Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    example: 74847,
    description: '사용자의 id',
  })
  id: number;

  @ApiProperty({
    example: 'dcho',
    description: '사용자의 닉네임',
  })
  @Matches(/^[^\s]+(\s+[^\s]+)*$/, {
    message: '앞뒤로 공백을 사용할 수 없습니다.',
  })
  @Matches(/^\w+$/, { message: '특수문자는 사용 할 수 없습니다.' })
  nickname: string;
}

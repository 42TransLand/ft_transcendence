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
  //@Matches(/^[a-z|A-Z|0-9|.]+$/, {
  //  message: '특수문자는 사용 할 수 없습니다.',
  //})
  @Matches(/^[^?%/#]+$/, { message: '유효하지 않는 글자(\\, %)입니다.' })
  nickname: string;
}

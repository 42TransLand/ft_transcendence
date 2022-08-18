import { ApiProperty } from '@nestjs/swagger';

export class ChatJoinNotifyDto {
  @ApiProperty({
    description: '유저 닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '유저 프로필',
  })
  profileImg: string;

  @ApiProperty({
    description: '유저 아이디',
  })
  id: string;
}

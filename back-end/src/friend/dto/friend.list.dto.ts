import { ApiProperty } from '@nestjs/swagger';

export class FriendListDto {
  @ApiProperty({
    example: 74847,
    description: '유저의 id',
  })
  id: string;

  @ApiProperty({
    example: 'dcho',
    description: '유저의 닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: 'files/profileImg/default.jpg',
    description: '유저의 프로필 이미지',
  })
  profileImg: string;

  @ApiProperty({
    example: false,
    description: '친구 차단 여부',
  })
  isBlocked: boolean;
}

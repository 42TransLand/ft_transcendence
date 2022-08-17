import { ApiProperty } from '@nestjs/swagger';

export class UserRecordDto {
  @ApiProperty({
    example: 74847,
    description: '이긴 유저의 id',
  })
  winUserId: string;

  @ApiProperty({
    example: 'dcho',
    description: '이긴 유저의 닉네임',
  })
  winUserNickname: string;

  @ApiProperty({
    example: 'files/profileImg/default.jpg',
    description: '이긴 유저의 프로필 이미지',
  })
  winUserProfileImg: string;

  @ApiProperty({
    example: 3,
    description: '이긴 유저의 점수',
  })
  winUserScore: number;

  @ApiProperty({
    example: 74873,
    description: '진 유저의 id',
  })
  loseUserId: string;

  @ApiProperty({
    example: 'jiholee',
    description: '진 유저의 닉네임',
  })
  loseUserNickname: string;

  @ApiProperty({
    example: 'files/profileImg/default.jpg',
    description: '진 유저의 프로필 이미지',
  })
  loseUserProfileImg: string;

  @ApiProperty({
    example: 1,
    description: '진 유저의 점수',
  })
  loseUserScore: number;
}

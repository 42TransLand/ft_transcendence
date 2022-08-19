import { ApiProperty } from '@nestjs/swagger';
import { UserRecordDto } from './user.record.dto';

export class UserProfileDto {
  @ApiProperty({
    example: 74847,
    description: '사용자의 id',
  })
  id: string;

  @ApiProperty({
    example: 'true',
    description: '사용자의 첫 로그인 여부',
  })
  isFirstLogin: boolean;

  @ApiProperty({
    example: 'dcho',
    description: '사용자의 닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: 'true',
    description: '2차 인증 여부',
  })
  tfaEnabled: boolean;

  @ApiProperty({
    example: 'dcho@student.42seoul.kr',
    description: '사용자의 이메일',
  })
  email: string;

  @ApiProperty({
    example: '1500',
    description: '사용자의 점수',
  })
  rankScore: number;

  @ApiProperty({
    example: 'files/profileImg/default.jpg',
    description: '사용자의 프로필 이미지',
  })
  profileImg: string;

  @ApiProperty({
    example: '15',
    description: '래더 승리 횟수',
  })
  winCount: number;

  @ApiProperty({
    example: '10',
    description: '래더 패배 횟수',
  })
  loseCount: number;

  @ApiProperty({
    example: '25',
    description: '래더 총 전적 횟수',
  })
  totalCount: number;

  @ApiProperty({
    description: '게임 기록',
  })
  gameRecord: UserRecordDto[];
}

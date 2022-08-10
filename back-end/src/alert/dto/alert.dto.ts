import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class AlertDto {
  @ApiProperty({
    example: '8faaf513-1153-4b75-8055-6e3f2e162a80',
    description: '알람 아이디',
  })
  alertId: string;

  @ApiProperty({
    example: 'dcho',
    description: '알람 보낸 사람의 닉네임',
  })
  requestor: User;

  @ApiProperty({
    example: '2020-08-01T00:00:00.000Z',
    description: '알림의 생성 시간',
  })
  createdAt: Date;
}

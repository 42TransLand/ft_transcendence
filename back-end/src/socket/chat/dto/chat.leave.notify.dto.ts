import { ApiProperty } from '@nestjs/swagger';

export class ChatLeaveNotifyDto {
  @ApiProperty({
    description: '유저 닉네임',
  })
  nickname: string;
}

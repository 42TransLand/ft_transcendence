import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageNotifyDto {
  @ApiProperty({
    description: '유저 닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '메시지 내용',
  })
  content: string;
}

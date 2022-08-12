import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from '../constants/chat.type.enum';

export class UpdateChatPasswordDto {
  @ApiProperty({
    description: '채팅방의 비밀번호',
  })
  password: string;

  @ApiProperty({
    description: '채팅방의 타입',
  })
  type: ChatType;
}

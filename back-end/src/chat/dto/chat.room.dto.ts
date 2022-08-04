import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from '../constants/chat.type.enum';

export class ChatRoomDto {
  @ApiProperty({
    description: '유저 닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '채팅방의 비밀번호',
  })
  password: string;
}

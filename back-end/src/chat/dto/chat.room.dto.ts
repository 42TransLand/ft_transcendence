import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from '../constants/chat.type.enum';

export class ChatRoomDto {
  @ApiProperty({
    description: '채팅방의 아이디',
  })
  id: string;

  @ApiProperty({
    description: '채팅방의 제목',
  })
  name: string;

  @ApiProperty({
    description: '채팅방의 공개 여부',
  })
  type: ChatType;

  @ApiProperty({
    description: '채팅방의 비밀번호',
  })
  password: string;
}

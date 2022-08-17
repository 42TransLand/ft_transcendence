import { ApiProperty } from '@nestjs/swagger';
import { ChatUSerUpdateType } from '../constants/chat.user.update.type.enum';

export class ChatUpdateUserNotifyDto {
  @ApiProperty({
    description: '유저 닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '채팅방 업데이트 유형',
  })
  type: ChatUSerUpdateType;

  @ApiProperty({
    description: '업데이트 종류',
  })
  status: boolean;
}

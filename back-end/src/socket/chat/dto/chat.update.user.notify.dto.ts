import { ApiProperty } from '@nestjs/swagger';
import { ChatUserUpdateType } from '../constants/chat.user.update.type.enum';

export class ChatUpdateUserNotifyDto {
  @ApiProperty({
    description: '유저 닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '채팅방 업데이트 유형',
  })
  type: ChatUserUpdateType;

  @ApiProperty({
    description: '업데이트 종류',
  })
  status: boolean;
}

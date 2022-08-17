import { ApiProperty } from '@nestjs/swagger';

export class ChatUpdateProtectionNotifyDto {
  @ApiProperty({
    description: '채팅방 타입 변경 여부',
  })
  status: boolean;
}

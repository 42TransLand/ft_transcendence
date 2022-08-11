import { ApiProperty } from '@nestjs/swagger';

export class UpdateChatPasswordDto {
  @ApiProperty({
    description: '채팅방의 비밀번호',
  })
  password: string;
}

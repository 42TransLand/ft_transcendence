import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { ChatType } from '../constants/chat.type.enum';

export class UpdateChatPasswordDto {
  @ApiProperty({
    description: '채팅방의 비밀번호',
  })
  @ValidateIf((room) => room.type === ChatType.PROTECT)
  @MinLength(3, { message: '채팅방 비밀버호는 3 ~ 10자 사이어야 합니다.' })
  @MaxLength(10, { message: '채팅방 비밀버호는 3 ~ 10자 사이어야 합니다.' })
  @IsString()
  password: string;

  @ApiProperty({
    description: '채팅방의 타입',
  })
  type: ChatType;
}

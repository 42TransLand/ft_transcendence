import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { ChatType } from '../constants/chat.type.enum';

export class CreateChatRoomDto {
  @ApiProperty({
    description: '채팅방 생성자 닉네임',
  })
  nickname: string;

  @ApiProperty({
    description: '채팅방의 제목 2~15자',
  })
  @MinLength(2, { message: '채팅방 이름은 2자 이상이어야 합니다.' })
  @MaxLength(20, { message: '채팅방 이름은 15자 이하이어야 합니다.' })
  @Matches(/^[^\s]+(\s+[^\s]+)*$/, { message: '제목 앞뒤로 공백을 사용할 수 없습니다.' })
  @Matches(/^[^\\%]+$/, { message: '유효하지 않는 글자(\\, %)입니다.' })
  name: string;

  @ApiProperty({
    description: '채팅방의 공개 여부',
  })
  type: ChatType;

  @ApiProperty({
    description: '채팅방의 비밀번호 3 ~ 10자',
  })
  @ValidateIf((room) => room.type === ChatType.PROTECT)
  @MinLength(3)
  @MaxLength(10, { message: '채팅방 비밀버호는 3 ~ 10자 사이어야 합니다.' })
  @IsString()
  password: string;
}

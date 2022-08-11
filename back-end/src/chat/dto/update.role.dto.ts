import { ApiProperty } from '@nestjs/swagger';
import { ChatRole } from '../constants/chat.role.enum';

export class UpdateRoleDto {
  @ApiProperty({
    description: '과거 어드민 유저 닉네임',
  })
  oldAdmin: string;

  @ApiProperty({
    description: '미래 어드민 유저 닉네임',
  })
  newAdmin: string;
}

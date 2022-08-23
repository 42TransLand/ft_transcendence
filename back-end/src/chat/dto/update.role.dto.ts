import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    description: '지정해줄 Admin 유저 닉네임',
  })
  nickname: string;
}

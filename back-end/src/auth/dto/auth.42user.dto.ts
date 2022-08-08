import { ApiProperty } from '@nestjs/swagger';

export class Auth42userDto {
  @ApiProperty({ description: 'required' })
  id: string;

  @ApiProperty({ description: 'required' })
  username: string;

  @ApiProperty({ description: 'required' })
  email: string;

  @ApiProperty({ description: 'required' })
  avatar: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class FriendDto {
  @ApiProperty({
    example: 'dcho',
    description: '요청을 보내는 사람의 닉네임',
  })
  requestor: string;

  @ApiProperty({
    example: 'plee',
    description: '요청을 받는 사람의 닉네임',
  })
  receiver: string;
}

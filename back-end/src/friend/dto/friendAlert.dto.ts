import { ApiProperty } from '@nestjs/swagger';

export class FriendAlertDto {
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

  @ApiProperty({
    example: '44259fbd-46f4-4ed1-a83b-831b1c05da5b',
    description: '알림의 id',
  })
  alertId: string;
}

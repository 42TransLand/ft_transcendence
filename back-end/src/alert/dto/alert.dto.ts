import { ApiProperty } from '@nestjs/swagger';

export class AlertDto {
  @ApiProperty({
    example: 'dcho',
    description: '알람 보낸 사람의 닉네임',
  })
  requestor: string;

  @ApiProperty({
    example: 'plee',
    description: '알림 받은 사람의 닉네임',
  })
  receiver: string;

  @ApiProperty({
    example: 'false',
    description: '알림의 읽음 여부',
  })
  read: boolean;
}

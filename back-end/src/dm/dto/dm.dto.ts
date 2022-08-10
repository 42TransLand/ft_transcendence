import { ApiProperty } from '@nestjs/swagger';

export class DmDto {
  @ApiProperty({
    example: '1',
    description: 'DM의 고유 id',
  })
  dmId: string;

  @ApiProperty({
    example: 'hello',
    description: 'DM 내용',
  })
  content: string;

  @ApiProperty({
    example: '123456789',
    description: 'DM을 보내는 사람의 id',
  })
  senderId: string;

  @ApiProperty({
    example: 'dcho',
    description: 'DM을 보내는 사람의 닉네임',
  })
  senderNickName: string;

  @ApiProperty({
    example: '123456789',
    description: 'DM을 받는 사람의 id',
  })
  receiverId: string;

  @ApiProperty({
    example: 'plee',
    description: 'DM을 받는 사람의 닉네임',
  })
  receiverNickName: string;

  @ApiProperty({
    example: '2020-01-01T00:00:00.000Z',
    description: 'DM이 생성된 시간',
  })
  createdAt: Date;
}

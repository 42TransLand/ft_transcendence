import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatType } from '../constants/chat.type.enum';

@Entity()
export class ChatRoom extends BaseEntity {
  @ApiProperty({
    example: '1234',
    description: '채팅방의 아이디',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '엄준식은 살아있다.',
    description: '채팅방의 제목',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: ChatType.PUBLIC,
    description: '채팅방의 공개 여부',
  })
  @Column()
  type: ChatType;

  @ApiProperty({
    example: '1qaz2wsx',
    description: '채팅방의 비밀번호',
  })
  @Column({ nullable: true })
  password: string;

  @ApiProperty({
    example: '2020-01-01',
    description: '채팅방의 생성 시간',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2020-01-01',
    description: '채팅방의 업데이트 시간',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}

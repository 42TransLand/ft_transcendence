import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendStatus } from '../constants/friend.enum';

@Entity()
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'dcho',
    description: '요청을 보내는 사람의 닉네임',
  })
  @ManyToOne(() => User, (user) => user.id)
  requestor: User;

  @ApiProperty({
    example: 'plee',
    description: '요청을 받는 사람의 닉네임',
  })
  @ManyToOne(() => User, (user) => user.id)
  receiver: User;

  @ApiProperty({
    example: 'NONE',
    description: '친구 상태',
  })
  @Column({ default: FriendStatus.NONE })
  status: FriendStatus;

  @ApiProperty({
    example: false,
    description: '차단 여부',
  })
  @Column({ default: false })
  block: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatRole } from '../constants/chat.role.enum';
import { ChatRoom } from './chat.room.entity';

@Entity()
export class ChatUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '기본키',
  })
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ApiProperty({
    description: '채팅방 아이디',
  })
  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.id)
  chatRoom: ChatRoom;

  @ApiProperty({
    description: '채팅방 유저 역할',
  })
  @Column()
  role: ChatRole;

  @Column({
    nullable: true,
    default: null,
  })
  unmutedAt: Date;

  @ApiProperty({
    example: '2020-01-01',
    description: '채팅방 유저 생성 시간',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2020-01-01',
    description: '채팅방 유저 업데이트 시간',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}

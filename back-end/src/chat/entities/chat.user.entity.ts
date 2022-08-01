import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { ChatRole } from '../constants/chat.role.enum';
import { ChatRoom } from './chat.room.entity';

@Entity()
export class ChatUser extends BaseEntity {
  @ApiProperty({
    description: '유저 아이디',
  })
  @ManyToOne(() => User, (user) => user.id)
  userId: User;

  @ApiProperty({
    description: '채팅방 아이디',
  })
  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.id)
  chatRoomId: ChatRoom;

  @ApiProperty({
    description: '채팅방 유저 역할',
  })
  @Column()
  role: ChatRole;

  @ApiProperty({
    example: '2020-01-01',
    description: '채팅방 유저 생성 시간',
  })
  @Column()
  createdAt: Date;

  @ApiProperty({
    example: '2020-01-01',
    description: '채팅방 유저 업데이트 시간',
  })
  @Column()
  updatedAt: Date;
}

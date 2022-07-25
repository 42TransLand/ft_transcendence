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
import { FriendStatus } from '../friend.enum';

@Entity()
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 친구요청을 보내는 사람 or 친구 수락하는 사람
  @ManyToOne(() => User, (user) => user.id)
  requestor: User;

  @ManyToOne(() => User, (user) => user.id)
  receiver: User;

  @Column({ default: FriendStatus.NONE })
  status: FriendStatus;

  @Column({ default: false })
  block: boolean;
}

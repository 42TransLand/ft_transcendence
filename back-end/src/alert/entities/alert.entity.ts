import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 알림 대상
  @ManyToOne(() => User, (user) => user.id)
  receiver: User;

  // 친구 요청 보낸사람 id
  @ManyToOne(() => User, (user) => user.id)
  requestor: User;

  @CreateDateColumn()
  createAt: Date;

  @Column()
  read: boolean;
}

import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Dm extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  sender: User;

  @ManyToOne(() => User, (user) => user.id)
  receiver: User;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}

import { GameMode } from '../constants/game.mode.enum';
import { User } from 'src/users/entities/user.entity';

import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class GameRecord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() =>User, () => User)
  @ManyToOne(() => User, (user) => user.id) // id로 바꿔야함
  leftUser: number;

  @ManyToOne(() => User, (user) => user.id) // id로 바꿔야함
  rightUser: number;

  @Column()
  leftUserScore: number;

  @Column()
  rightUserScore: number;

  @Column()
  result: number; // left_win: 1, right_win: 2

  @Column()
  type: GameMode;

  // @Column()
  // mode: string;

  @CreateDateColumn()
  createAt: Date;

  @CreateDateColumn()
  updateAt: Date;
}

import { GameMode } from '../constants/game.mode.enum';
import { User } from 'src/users/entities/user.entity';

import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class GameRecord extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() =>User, () => User)
  @ManyToOne(() => User, (user) => user.id) // id로 바꿔야함
  leftUser: number;

  @ManyToOne(() => User, (user) => user.id) // id로 바꿔야함
  rightUser: number;

  @Column({ default: 0 })
  leftUserScore: number;

  @Column({ default: 0 })
  rightUserScore: number;

  @Column({ default: 0 })
  result: number; // left_win: 1, right_win: 2

  @Column({ default: GameMode.LADDER_GAME })
  type: GameMode;

  // @Column()
  // mode: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

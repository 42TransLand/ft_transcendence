import { ApiProperty } from '@nestjs/swagger';
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
import { GameMode } from '../constants/game.mode.enum';

@Entity()
export class GameRecord extends BaseEntity {
  @ApiProperty({
    description: '게임 기록 고유 아이디',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '왼쪽 유저 아이디',
    type: () => User,
  })
  // @ManyToOne(() =>User, () => User)
  @ManyToOne(() => User, (user) => user.id)
  winUser: User;

  @ApiProperty({
    description: '오른쪽 유저 아이디',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.id)
  loseUser: User;

  @ApiProperty({
    description: '왼쪽 유저 스코어',
  })
  @Column({ default: 0 })
  winUserScore: number;

  @ApiProperty({
    description: '오른쪽 유저 스코어',
  })
  @Column({ default: 0 })
  loseUserScore: number;

  // @ApiProperty({
  //   example: 1,
  //   description: '왼쪽 유저의 승패 여부 (0: 패배, 1: 승리)',
  // })
  // @Column({ default: 0 })
  // result: number;

  @ApiProperty({
    example: false,
    description: '래더 게임 여부',
  })
  @Column({ default: false })
  isLadder: boolean;

  @ApiProperty({
    example: GameMode.CLASSIC,
    description: '게임 모드',
  })
  @Column({ default: GameMode.CLASSIC })
  type: GameMode;

  @ApiProperty({
    example: '2020-01-01',
    description: '게임 시작 시간',
  })
  @CreateDateColumn()
  createAt: Date;

  @ApiProperty({
    example: '2020-01-01',
    description: '게임 종료 시간',
  })
  @UpdateDateColumn()
  updateAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { GameRecord } from 'src/game/entities/game.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

export const DEFAULT_PROFILE_IMG = 'files/profileImg/default.jpg';

@Entity()
export class User extends BaseEntity {
  @Column({ primary: true })
  id: string;

  @Column({ default: true })
  isFirstLogin: boolean;

  @Column({ unique: true })
  nickname: string;

  @Column()
  email: string;

  @Column({ default: DEFAULT_PROFILE_IMG })
  profileImg: string;

  @Column({ nullable: true })
  tfaSecret?: string;

  @Column({ default: false })
  tfaEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: '사용자의 게임 기록',
    type: GameRecord,
    isArray: true,
  })
  @OneToMany(() => GameRecord, (record) => record.winUser, { eager: true })
  @OneToMany(() => GameRecord, (record) => record.loseUser, {
    eager: true,
  })
  records: GameRecord[];

  @ApiProperty({
    description: '사용자 랭크용 게임 점수',
  })
  @Column({ default: 1500 })
  rankScore: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { GameRecord } from 'src/game/entities/game.entity';
import { Transform } from 'stream';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ primary: true })
  id: string;

  @ApiProperty({
    example: 'dcho',
    description: '사용자의 닉네임',
  })
  @Column({ unique: true })
  nickname: string;

  @Column()
  email: string;

  @Column({ default: 'files/profileImg/default.jpg' })
  profileImg: string;

  //@Column()
  //status: string;

  //@Column()
  //accessToken: string;

  //@Column()
  //twoFactorAuth: boolean;

  //@Column()
  //twoFactorAuthUri: string;

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

import { ApiProperty } from '@nestjs/swagger';
import { GameRecord } from 'src/game/entities/game.entity';
import { Transform } from 'stream';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'dcho',
    description: '사용자의 닉네임',
  })
  @Column()
  nickname: string;

  //@Column()
  //email: string;

  //@Column()
  //profileIcon: string;

  //@Column()
  //status: string;

  //@Column()
  //accessToken: string;

  //@Column()
  //twoFactorAuth: boolean;

  //@Column()
  //twoFactorAuthUri: string;

  //@CreateDateColumn()
  //createdAt: Date;

  //@UpdateDateColumn()
  //updatedAt: Date;

  @ApiProperty({
    description: '사용자의 게임 기록',
    type: GameRecord,
    isArray: true,
  })
  @OneToMany(() => GameRecord, (record) => record.leftUser, { eager: true })
  @OneToMany(() => GameRecord, (record) => record.rightUser, {
    eager: true,
  })
  records: GameRecord[];
}

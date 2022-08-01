import { ApiProperty } from '@nestjs/swagger';
import { GameRecord } from 'src/game/entities/game.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'dcho',
    description: '사용자의 닉네임',
  })
  @Column()
  nickname: string;

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

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

  @Column()
  nickname: string;

  @OneToMany(() => GameRecord, (record) => record.leftUser, { eager: true })
  @OneToMany(() => GameRecord, (record) => record.rightUser, {
    eager: true,
  })
  records: GameRecord[];
}

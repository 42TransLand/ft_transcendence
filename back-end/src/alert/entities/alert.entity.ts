import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({
    example: 'dcho',
    description: '알림 대상',
  })
  @ManyToOne(() => User, (user) => user.id)
  receiver: User;

  @ApiProperty({
    example: 'jiholee',
    description: '요청 보낸사람',
  })
  @ManyToOne(() => User, (user) => user.id)
  requestor: User;

  @CreateDateColumn()
  createAt: Date;

  @Column()
  read: boolean;
}

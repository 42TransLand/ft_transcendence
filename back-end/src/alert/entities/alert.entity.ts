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
    example: 'plee',
    description: '알림 받은 사람의 닉네임',
  })
  @ManyToOne(() => User, (user) => user.id)
  receiver: User;

  @ApiProperty({
    example: 'dcho',
    description: '알람 보낸 사람의 닉네임',
  })
  @ManyToOne(() => User, (user) => user.id)
  requestor: User;

  @ApiProperty({
    example: 'false',
    description: '알림의 읽음 여부',
  })
  @Column()
  read: boolean;

  @ApiProperty({
    example: '2020-01-01',
    description: '알림의 생성 시간',
  })
  @CreateDateColumn()
  createAt: Date;
}

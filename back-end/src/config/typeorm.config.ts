import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Alert } from 'src/alert/entities/alert.entity';
import { Friend } from 'src/friend/entities/friend.entity';
import { GameRecord } from 'src/game/entities/game.entity';
import { User } from 'src/users/entities/user.entity';

const configService = new ConfigService();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  password: configService.get('DB_PASSWORD'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  database: 'transcendence',
  autoLoadEntities: true,
  entities: [User, GameRecord, Friend, Alert],
  synchronize: true,
};

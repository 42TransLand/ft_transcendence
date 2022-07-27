import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Alert } from 'src/alert/entities/alert.entity';
import { Friend } from 'src/friend/entities/friend.entity';
import { GameRecord } from 'src/game/entities/game.entity';
import { User } from 'src/users/entities/user.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  // host: 'database'
  host: 'localhost',
  password: 'password',
  port: 5432,
  // username: 'transland',
  username: 'postgres',
  database: 'transcendence',
  autoLoadEntities: true,
  entities: [User, GameRecord, Friend, Alert],
  synchronize: true,
};

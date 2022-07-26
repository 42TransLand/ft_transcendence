import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Friend } from 'src/friend/entities/friend.entity';
import { GameRecord } from 'src/game/entities/game.entity';
import { User } from 'src/users/entities/user.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  password: 'password',
  port: 5432,
  username: 'transland',
  database: 'transcendence',
  autoLoadEntities: true,
  entities: [User, GameRecord, Friend],
  synchronize: true,
};

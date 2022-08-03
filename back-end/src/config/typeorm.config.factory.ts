import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Alert } from 'src/alert/entities/alert.entity';
import { ChatUser } from 'src/chat/entities/chat.user.entity';
import { Friend } from 'src/friend/entities/friend.entity';
import { GameRecord } from 'src/game/entities/game.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatRoom } from '../chat/entities/chat.room.entity';

export async function TypeOrmConfigFactory(
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    autoLoadEntities: true,
    entities: [User, GameRecord, Friend, Alert, ChatRoom, ChatUser],
    synchronize: true,
  };
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendModule } from './friend/friend.module';
import { AlertModule } from './alert/alert.module';
import { SocketModule } from './socket/socket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmConfigFactory } from './config/typeorm.config.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'prod'}.local`,
        `.env.${process.env.NODE_ENV || 'prod'}`,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: TypeOrmConfigFactory,
    }),
    UsersModule,
    GameModule,
    ScheduleModule.forRoot(),
    FriendModule,
    AlertModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { ChatModule } from './chat/chat.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { DmModule } from './dm/dm.module';
import { AuthModule } from './auth/auth.module';
import { TfaModule } from './tfa/tfa.module';

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
    ChatModule,
    DmModule,
    AuthModule,
    TfaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

// forRoutes(컨트롤러)나 forRoutes(주소)로 특정 주소에만 미들웨어 적용 가능
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 미들웨어는 consumer에다가 연결한다.
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

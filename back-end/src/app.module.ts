import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [
    // UsersModule,
    // GameModule,
    // TypeOrmModule.forRoot(typeORMConfig),
    // FriendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

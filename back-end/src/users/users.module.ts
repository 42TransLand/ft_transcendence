import { Module } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthJwtFactory } from 'src/auth/auth.jwt.factory';
import { GameService } from 'src/game/game.service';
import { GameRepository } from 'src/game/game.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmExModule.forCustomRepository([GameRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: AuthJwtFactory,
    }),
  ],
  controllers: [UsersController],
  providers: [GameService, UsersService, JwtStrategy],
})
export class UsersModule {}

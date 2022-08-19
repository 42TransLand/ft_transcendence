import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthJwtFactory } from 'src/auth/auth.jwt.factory';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { GameRepository } from 'src/game/game.repository';
import { GameService } from 'src/game/game.service';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { JwtTfaStrategy } from './jwt.tfa.strategy';
import { TfaController } from './tfa.controller';
import { TfaService } from './tfa.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmExModule.forCustomRepository([GameRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: AuthJwtFactory,
    }),
  ],
  controllers: [TfaController],
  providers: [
    TfaService,
    UsersService,
    GameService,
    JwtTfaStrategy,
    AuthService,
  ],
})
export class TfaModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { Strategy42 } from './42auth.strategy';
import { AuthController } from './auth.controller';
import { AuthJwtFactory } from './auth.jwt.factory';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: AuthJwtFactory,
    }),
    HttpModule,
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],

  controllers: [AuthController],
  providers: [AuthService, Strategy42, UsersService],
  exports: [PassportModule, Strategy42],
})
export class AuthModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { Strategy42 } from './42auth.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.get('jwt.secret'),
      signOptions: { expiresIn: 36000 },
    }),
    HttpModule,
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],

  controllers: [AuthController],
  providers: [AuthService, Strategy42, UsersService],
  exports: [PassportModule, Strategy42],
})
export class AuthModule {}

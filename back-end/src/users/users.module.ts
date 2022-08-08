import { Module } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.get('jwt.secret'),
      signOptions: { expiresIn: 36000 },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule {}

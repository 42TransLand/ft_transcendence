import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { GameRepository } from './game.repository';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/users.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([GameRepository]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],
  providers: [GameService, UsersService],
  controllers: [GameController],
})
export class GameModule {}

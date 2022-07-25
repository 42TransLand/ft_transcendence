import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { GameRepository } from './game.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([GameRepository])],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}

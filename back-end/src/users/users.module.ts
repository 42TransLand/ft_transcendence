import { Module } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmExModule } from 'src/custom/typeorm.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

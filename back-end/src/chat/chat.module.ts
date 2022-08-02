import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmExModule } from 'src/custom/typeorm.module';
import { ChatRoomRepository } from './chat.room.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ChatRoomRepository])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

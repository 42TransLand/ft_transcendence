import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DmService } from './dm.service';
import { DmDto } from './dto/dm.dto';
import { Dm } from './entities/dm.entity';

@ApiTags('DM')
@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @ApiOperation({ summary: '서로 주고 받은 DM 전부 불러오기' })
  @Get(':nickname/dms') // 상대방 nickname
  getDMsByUser(
    @Param('nickname') nickname: string,
    @Body() { sender }: DmDto, // 자신의 nickname, GetUser로 대체할 수 있음
  ): Promise<Dm[]> {
    return this.dmService.getDMsByUser(sender, nickname);
  }

  @Post('/sendDM')
  create(@Body() { sender, receiver, content }: DmDto): Promise<Dm> {
    return this.dmService.createDM(sender, receiver, content);
  }
}

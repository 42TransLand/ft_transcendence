import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/users/get.user.decorator';
import { DmService } from './dm.service';
import { DmDto } from './dto/dm.dto';
import { SendDmDto } from './dto/send.dm.dto';
import { Dm } from './entities/dm.entity';

@ApiTags('DM')
@Controller('dm')
@UseGuards(AuthGuard('jwt'))
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @ApiOperation({ summary: '서로 주고 받은 DM 전부 불러오기' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 유저를 요청했을 때' })
  @Get('/:nickname/')
  getDMsByUser(
    @GetUser() user: User,
    @Param('nickname') nickname: string,
  ): Promise<DmDto[]> {
    return this.dmService.getDMsByUser(user, nickname);
  }

  @ApiOperation({ summary: 'DM 전송' })
  @Post('/send/:nickname')
  create(
    @GetUser() user: User,
    @Param('nickname') receiver: string,
    @Body() { content }: SendDmDto,
  ): Promise<void> {
    return this.dmService.createDM(user, receiver, content);
  }
}

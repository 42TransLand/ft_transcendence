import { Controller, Get, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AlertService } from './alert.service';
import { AlertDto } from './dto/alert.dto';
import { Alert } from './entities/alert.entity';

@ApiTags('Alert')
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @ApiOperation({
    summary: '모든 알람 조회',
  })
  @Get()
  findAll(@Body() alertDto: AlertDto): Promise<Alert[]> {
    const nickName = alertDto.receiver;
    return this.alertService.findAll(nickName);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.alertService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() alertDto: AlertDto) {
  //   return this.alertService.update(+id, alertDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.alertService.remove(+id);
  // }
}

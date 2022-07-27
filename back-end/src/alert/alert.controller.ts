import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { AlertService } from './alert.service';
import { AlertDto } from './dto/alert.dto';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  //@ApiOperation({
  //  summary: '모든 알람 조회',
  //})
  //@Get()
  //findAll() {
  //  return this.alertService.findAll();
  //}

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

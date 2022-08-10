import { Controller, Get, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/users/get.user.decorator';
import { AlertService } from './alert.service';
import { AlertDto } from './dto/alert.dto';
import { Alert } from './entities/alert.entity';

@ApiTags('Alert')
@Controller('alert')
@UseGuards(AuthGuard('jwt'))
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @ApiOperation({ summary: '유저 알람 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @Get()
  findAll(@GetUser() user: User): Promise<AlertDto[]> {
    return this.alertService.findAll(user);
  }
}

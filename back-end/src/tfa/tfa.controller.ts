import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { TfaDto } from './dto/tfa.dto';
import { TfaService } from './tfa.service';

@Controller('tfa')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class TfaController {
  constructor(
    private readonly tfaService: TfaService,
    private readonly userService: UsersService,
  ) {}

  @Post('generate')
  async register(@Res() res: Response, @Req() req) {
    const { otpauthUrl } = await this.tfaService.generateTfaSecret(req.user);
    return this.tfaService.pipeQrCodeStream(res, otpauthUrl);
  }

  @Post('turnOn')
  async turnOn(@Req() req, @Body() { code }: TfaDto) {
    const isCodeValid = await this.tfaService.isTfaCodeValid(req.user, code);
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid code');
    }
    await this.userService.turnOnTfa(req.user);
  }

  @Patch('turnOff')
  async turnOff(@Req() req) {
    await this.userService.turnOffTfa(req.user);
    return HttpStatus.OK;
  }

  @Get('authenticate')
  async authenticate(@Req() req, @Body() { code }: TfaDto) {
    const isCodeValid = await this.tfaService.isTfaCodeValid(req.user, code);
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid code');
    }
    return HttpStatus.OK;
  }
}

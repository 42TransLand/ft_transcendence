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
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { TfaDto } from './dto/tfa.dto';
import { JwtTfaAuthGuard } from './jwt.tfa.guard';
import { TfaService } from './tfa.service';

@Controller('tfa')
@UseInterceptors(ClassSerializerInterceptor)
export class TfaController {
  constructor(
    private readonly tfaService: TfaService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('generate')
  async register(@Res() res: Response, @Req() req) {
    const { otpauthUrl } = await this.tfaService.generateTfaSecret(req.user);
    return this.tfaService.pipeQrCodeStream(res, otpauthUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('turnOn')
  async turnOn(@Req() req, @Body() { code }: TfaDto) {
    const isCodeValid = await this.tfaService.isTfaCodeValid(req.user, code);
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid code');
    }
    await this.userService.turnOnTfa(req.user);
    const token = await this.authService.generateAccessToken(req.user.id, true);
    req.res.setHeader('Set-Cookie', token);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('turnOff')
  async turnOff(@Req() req) {
    await this.userService.turnOffTfa(req.user);
    const token = await this.authService.generateAccessToken(req.user.id);
    req.res.setHeader('Set-Cookie', token);
    return HttpStatus.OK;
  }

  @UseGuards(JwtTfaAuthGuard)
  @Post('authenticate')
  async authenticate(@Req() req, @Body() { code }: TfaDto) {
    const isCodeValid = await this.tfaService.isTfaCodeValid(req.user, code);
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid code');
    }
    const token = await this.authService.generateAccessToken(req.user.id, true);
    req.res.setHeader('Set-Cookie', token);
    return HttpStatus.OK;
  }
}

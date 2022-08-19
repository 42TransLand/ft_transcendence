import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/42')
  @UseGuards(AuthGuard('42'))
  @HttpCode(200)
  async login42() {
    return HttpStatus.OK;
  }

  @Get('/42/redirect')
  @UseGuards(AuthGuard('42'))
  async getRedirect42(@Req() req, @Res() res) {
    let user: User;
    try {
      user = await this.userService.findById(req.user.id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        user = await this.userService.createUser(req.user);
      }
    }
    const token = await this.authService.generateAccessToken(req.user.id);
    res.setHeader('Set-Cookie', token);
    res.redirect(this.configService.get('AUTH_REDIRECT_URL'));
  }
}

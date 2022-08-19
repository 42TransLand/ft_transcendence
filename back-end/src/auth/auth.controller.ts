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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
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
    try {
      await this.userService.findById(req.user.id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        await this.userService.createUser(req.user);
      }
    }
    const accessToken = await this.jwtService.sign({ id: req.user.id });
    res.setHeader(
      'Set-Cookie',
      `Authentication=${accessToken}; Path=/; Max-Age=36000`,
    );
    res.redirect(this.configService.get('AUTH_REDIRECT_URL'));
  }
}

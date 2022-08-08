import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
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
    const isUserExist = await this.userService.findById(req.user.id);
    if (!isUserExist) {
      await this.userService.createUser(req.user);
    }

    res.redirect('http://localhost:3000/');
  }
}

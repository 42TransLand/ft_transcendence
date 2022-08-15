import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, CallBack } from 'passport-42';
import { AuthService } from './auth.service';
import { Auth42userDto } from './dto/auth.42user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Strategy42 extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('42API_UID'),
      clientSecret: configService.get('42API_SECRET'),
      callbackURL: configService.get('42API_CALLBACK_URL'),
      socope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    callback: CallBack,
  ) {
    const user: Auth42userDto = await this.authService.getUserMe(accessToken);
    if (!user)
      throw new BadRequestException('Bad Request while checking access token');
    return callback(null, user);
  }
}

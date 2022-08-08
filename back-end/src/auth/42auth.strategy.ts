import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, CallBack } from 'passport-42';
import * as config from 'config';
import { AuthService } from './auth.service';
import { Auth42userDto } from './dto/auth.42user.dto';

@Injectable()
export class Strategy42 extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: config.get('42.uid'),
      clientSecret: config.get('42.secret'),
      callbackURL: config.get('42.callbackURL'),
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

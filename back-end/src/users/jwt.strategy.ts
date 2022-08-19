import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
    });
  }

  async validate(payload: any) {
    console.log(payload);
    const user: User = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.tfaEnabled) {
      if (!payload.isTfaAuthenticated) {
        throw new UnauthorizedException('TFA not authenticated');
      }
    }
    return user;
  }
}

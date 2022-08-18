import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { toFileStream } from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TfaService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTfaSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'TransLand', secret);
    await this.userService.setTfaSecret(secret, user);
    return {
      secret,
      otpauthUrl,
    };
  }

  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async isTfaCodeValid(user: User, code: string) {
    return authenticator.verify({
      token: code,
      secret: user.tfaSecret,
    });
  }
}

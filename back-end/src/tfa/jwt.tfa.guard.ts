// 백업용

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtTfaAuthGuard extends AuthGuard('jwt-tfa') {}

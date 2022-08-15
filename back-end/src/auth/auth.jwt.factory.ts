import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export async function AuthJwtFactory(
  configService: ConfigService,
): Promise<JwtModuleOptions> {
  return {
    secret: configService.get('JWT_SECRET_KEY'),
    signOptions: { expiresIn: 36000 },
  };
}

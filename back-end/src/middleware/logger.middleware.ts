import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    // 1 - middleware는 router(controller) 실행전에 시작되어서
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    // 3 - router(controller) 끝나고 로깅 실행
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
    // 2 - router(controller) 실행
    next();
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}

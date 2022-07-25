import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

declare const module: any;

async function bootstrap() {
  //console.log(join(__dirname, '/../**/*.entity.{js,ts}'));
  //console.log(__dirname + '/../**/*.entity.{js,ts}');

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

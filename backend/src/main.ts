import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT );
  const frontendUrl = process.env.FRONTEND_URL ;

  app.enableCors({
    origin: frontendUrl,
  });

  await app.listen(port);
}
bootstrap();

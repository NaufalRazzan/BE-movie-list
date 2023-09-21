import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config()

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().addBearerAuth()
  .setTitle('Login with JWT and Movie CRUD Table List API')
  .setDescription('The API description')
  .setVersion('1.0')
  .addTag('Movies')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Payment API')
      .setDescription('Auth/Payment service API documentation')
      .setVersion('1.0.0')
      .addApiKey(
        { type: 'apiKey', name: 'Authorization', in: 'header' },
        'auth',
      )
      .addSecurityRequirements('auth')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(3000, '0.0.0.0');
}

bootstrap();

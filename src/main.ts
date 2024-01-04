import helmet from 'helmet';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.setGlobalPrefix('api');

  app.use(
    session({
      // @ts-expect-error remake
      secret: process.env.SESSION_SECRET,
      // @ts-expect-error remake
      resave: process.env.SESSION_RESAVE,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

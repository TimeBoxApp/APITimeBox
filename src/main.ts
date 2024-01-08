import helmet from 'helmet';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { createClient } from 'redis';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisClient = createClient();
  redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'tb-session:'
  });

  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:8080'],
    methods: ['GET', 'POST'],
    credentials: true
  });
  app.setGlobalPrefix('api');

  app.use(
    session({
      store: redisStore,
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

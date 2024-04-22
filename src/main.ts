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
  const isProd = process.env.NODE_ENV === 'production';
  const redisClient = createClient({
    url: isProd ? `rediss://${process.env.REDIS_HOST}:6379` : `redis://${process.env.REDIS_HOST}:6379`
  });
  redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'tb-session:'
  });

  app.use(helmet());
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
  });

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || '',
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

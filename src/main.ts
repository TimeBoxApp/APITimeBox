import helmet from 'helmet';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { createClient } from 'redis';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // @ts-expect-error todo
  const redisClient = createClient({ socket: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT } });
  redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'tb-session:'
  });

  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:8001'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
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
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

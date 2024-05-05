import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import { RedisIoAdapter } from './chat/adapter/redis.adapter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.enableCors({
    origin: 'http://localhost:3000', // Replace with allowed origin(s)
    credentials: true, // Set to true if sending cookies or authentication headers across origins
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed request headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Allowed HTTP methods
  })
  app.use(cookieParser())
  await app.listen(3001);
}
bootstrap();

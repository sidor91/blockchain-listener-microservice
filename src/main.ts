import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { gRpcConfig } from './config/gRpc.config';

async function bootstrap() {
  console.log('Starting Event Listener microservice... 🚀🚀🚀 ');
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(gRpcConfig);
  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3001);
}
bootstrap();

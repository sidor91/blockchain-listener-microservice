import { registerAs } from '@nestjs/config';
import { Transport, ClientProviderOptions } from '@nestjs/microservices';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const rmqClientName = 'EVENTS_LISTENER';
export const queueName = 'new-event';

const rmqConfig: ClientProviderOptions = {
  name: rmqClientName,
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RMQ_SERVER_URL],
    queue: queueName,
    queueOptions: {
      durable: true,
    },
  },
};

export default registerAs('rmqConfig', () => rmqConfig);

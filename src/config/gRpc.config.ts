import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

export const gRpcConfig: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'listener',
    protoPath: join(__dirname, '../proto/listener.proto'),
  },
};

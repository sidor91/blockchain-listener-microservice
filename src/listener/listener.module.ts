import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Web3Module } from 'src/web3/web3.module';
import { StartBlockModule } from 'src/start_block/start_block.module';
import { HttpModule } from '@nestjs/axios';

import { ListenerService } from './listener.service';
import { EventsService } from './services/events.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { ListenerController } from './listener.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import { Web3Service } from 'src/web3/web3.service';
import { rmqClientName } from 'src/config/rmq.config';

@Module({
  imports: [
    ConfigModule,
    Web3Module,
    HttpModule,
    StartBlockModule,
    UtilsModule,
  ],
  providers: [
    ListenerService,
    EventsService,
    UtilsService,
    Web3Service,
    {
      provide: rmqClientName,
      useFactory: (configService: ConfigService) => {
        const rmqConfig = configService.get('rmqConfig');
        return ClientProxyFactory.create(rmqConfig);
      },
      inject: [ConfigService],
    },
  ],
  controllers: [ListenerController],
})
export class ListenerModule {}

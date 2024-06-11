import { Inject, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { StartBlockService } from 'src/start_block/start_block.service';
import { UtilsService } from 'src/utils/utils.service';
import { Web3Service } from 'src/web3/web3.service';
import { CheckEventsDto } from '../dto/start-listener.dto';
import { ClientProxy } from '@nestjs/microservices';
import { rmqClientName, queueName } from 'src/config/rmq.config';

@Injectable()
export class EventsService {
  private logger = new Logger(EventsService.name);

  constructor(
    private readonly web3Service: Web3Service,
    private readonly startBlockService: StartBlockService,
    private readonly utilsSrvice: UtilsService,
    @Inject(rmqClientName) private RMQclient: ClientProxy,
  ) {}

  async checkEvents(chainId: string, eventName: string, dto: CheckEventsDto) {
    const { abi, startBlock, batchSize, contractAddress, rpc } = dto;
    try {
      const web3 = this.web3Service.findOrCreateWeb3Service(
        rpc,
        Number(chainId),
      );
      const contract = this.web3Service.getContract(
        JSON.parse(abi),
        contractAddress,
        web3,
      );
      const latestBlock = await this.web3Service.getLatestBlock(web3);
      const startFromBlock = await this.startBlockService.findOrCreate(
        contractAddress,
        chainId,
        eventName,
        startBlock || Number(latestBlock),
      );

      for (let idx = startFromBlock; idx < latestBlock; idx += batchSize) {
        const to =
          idx + batchSize > Number(latestBlock)
            ? Number(latestBlock)
            : idx + batchSize;

        const events = await this.utilsSrvice.checkEvent(
          contract,
          eventName,
          idx,
          to,
        );

        if (events.length > 0) {
          for (const event of events) {
            const jsonEvent = this.utilsSrvice.bigIntToJSON(event);
            await lastValueFrom(
              this.RMQclient.send(queueName, {
                event: jsonEvent,
                chainId,
              }),
            );
          }
        }

        await this.startBlockService.update(
          contractAddress,
          chainId,
          eventName,
          to,
        );
      }

      await this.startBlockService.update(
        contractAddress,
        chainId,
        eventName,
        Number(latestBlock) + 1,
      );

      return { success: true };
    } catch (err) {
      return this.logger.error(`Error checking events: ${err}`);
    }
  }
}

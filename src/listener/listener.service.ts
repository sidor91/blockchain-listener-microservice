import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { EventsService } from './services/events.service';
import { UtilsService } from 'src/utils/utils.service';
import { StartListenerDto, CommonListenerDto } from './dto/start-listener.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ListenerService implements OnModuleInit {
  private contracts: Record<string, { isWorking: boolean }> = {};
  private logger = new Logger(ListenerService.name);
  private subscriptionDelay = 5000;

  constructor(
    private readonly eventsService: EventsService,
    private readonly utilsSrvice: UtilsService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    try {
      await lastValueFrom(
        this.httpService.get(
          `${process.env.MAIN_APP_URL}event-handler/start-listener`,
        ),
      );
      this.logger.log('Event listener service successfully started');
    } catch (error) {
      this.logger.warn(`Seems like the main app is not available`);
    }
  }

  generateContractName(dto: CommonListenerDto) {
    return `${dto.contractAddress}-${dto.chainId}`;
  }

  async startListener(dto: StartListenerDto) {
    const contract = this.generateContractName(dto);

    if (!this.contracts[contract] || !this.contracts[contract].isWorking) {
      this.contracts[contract] = { isWorking: true };
      this.logger.log(`Starting listener for contract: ${contract}`);
      await this.listenEvents(dto);
    } else {
      this.logger.warn(`Listener for contract: ${contract} is already running`);
    }
  }

  async stopListener(dto: CommonListenerDto) {
    const contract = this.generateContractName(dto);
    if (
      this.contracts[contract] &&
      this.contracts[contract].isWorking !== false
    ) {
      this.contracts[contract].isWorking = false;
    }
    return {
      success: true,
      message: `Event listener service for contract ${dto.contractAddress} and chainId ${dto.chainId} has been stopped`,
    };
  }

  stopAllListeners() {
    Object.values(this.contracts).forEach(({ isWorking }) => {
      if (isWorking) {
        isWorking = false;
      }
    });
  }

  async listenEvents(dto: StartListenerDto) {
    const { chainId, eventNames, ...restDto } = dto;
    const contract = this.generateContractName(dto);
    while (this.contracts[contract]?.isWorking) {
      try {
        this.logger.debug(`[CHAIN_ID: ${chainId}]: Check events is started`);
        for (const name of eventNames) {
          await this.eventsService.checkEvents(chainId, name, restDto);
        }
        this.logger.debug(`[CHAIN_ID: ${chainId}]: Check events is finished`);
      } catch (error) {
        this.logger.error('There was an error during check events:', error);
      } finally {
        await this.utilsSrvice.sleep(this.subscriptionDelay);
      }
    }
  }
}

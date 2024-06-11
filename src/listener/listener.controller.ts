import { Controller } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { StartListenerDto, CommonListenerDto } from './dto/start-listener.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class ListenerController {
  constructor(private listenerService: ListenerService) {}

  @GrpcMethod('EventListenerService', 'StartListener')
  async startListener(dto: StartListenerDto) {
    this.listenerService.startListener(dto);
    return {
      success: true,
      message: `Event listener service for contract ${dto.contractAddress} and chainId ${dto.chainId} starts`,
    };
  }

  @GrpcMethod('EventListenerService', 'StopListener')
  async stopListener(dto: CommonListenerDto) {
    return this.listenerService.stopListener(dto);
  }
}

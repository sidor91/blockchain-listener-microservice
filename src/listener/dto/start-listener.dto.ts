import { PartialType } from '@nestjs/mapped-types';
import {
  IsNumberString,
  ArrayNotEmpty,
  IsEthereumAddress,
  IsNumber,
  IsString,
} from 'class-validator';

export class CommonListenerDto {
  @IsEthereumAddress({ message: 'Must be an etherium address!' })
  contractAddress: string;

  @IsNumberString({}, { message: 'Must be a number in a string format!' })
  chainId: string;
}

export class StartListenerDto extends CommonListenerDto {
  @ArrayNotEmpty({ message: 'Must be string array!' })
  eventNames: string[];

  @IsNumber({}, { message: 'Must be a number!' })
  startBlock: number;

  @IsNumber({}, { message: 'Must be a number!' })
  batchSize: number;

  @IsString({ message: 'Must be a string!' })
  abi: string;

  @IsString({ message: 'Must be a string!' })
  rpc: string;
}

export class CheckEventsDto extends PartialType(StartListenerDto) {}

import { IsInt, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateStartBlockDto {
  @IsNotEmpty({ message: 'Must be fulfilled!' })
  @IsNumberString({}, { message: 'Must be string integer!' })
  readonly chain_id: string;

  @IsNotEmpty({ message: 'Must be fulfilled!' })
  @IsString({ message: 'Must be string!' })
  readonly event_name: string;

  @IsNotEmpty({ message: 'Must be fulfilled!' })
  @IsInt({ message: 'Must be integer!' })
  block_number: number;

  @IsNotEmpty({ message: 'Must be fulfilled!' })
  @IsString({ message: 'Must be string!' })
  contract_address: string;
}

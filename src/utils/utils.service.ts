import { Injectable } from '@nestjs/common';
import { Contract } from 'web3';

@Injectable()
export class UtilsService {
  sleep(ms: number) {
    new Promise((r) => setTimeout(r, ms));
  }

  checkEvent = (
    contract: Contract<any>,
    event: string,
    fromBlock: number,
    toBlock: number | bigint,
  ): Promise<Array<any>> => {
    let retryCount = 0;

    const getEvents = async () => {
      try {
        return await contract.getPastEvents(event, {
          fromBlock,
          toBlock,
        });
      } catch (err) {
        retryCount++;
        if (retryCount >= 5) {
          throw new Error(`Check event retries exceeded limit: ${err}`);
        }
        return getEvents();
      }
    };

    return getEvents();
  };

  bigIntToJSON(obj: any): any {
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
  }
}

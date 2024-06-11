import { Injectable } from '@nestjs/common';
import { Contract, ContractAbi, Web3 } from 'web3';

@Injectable()
export class Web3Service {
  web3: Record<number, Web3> = {};

  findOrCreateWeb3Service(rpc: string, chainId: number) {
    if (!this.web3[chainId]) {
      this.web3[chainId] = new Web3(rpc);
    }
    return this.web3[chainId];
  }

  async getLatestBlock(web3: Web3) {
    return await web3.eth.getBlockNumber();
  }

  public getContract(
    abi: ContractAbi,
    address: string,
    web3: Web3,
  ): Contract<ContractAbi> {
    return new Contract(abi, address, web3);
  }
}

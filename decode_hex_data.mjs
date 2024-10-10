import { getContractsFactory } from '@bitgo/smart-contracts';
import { BitGoAPI } from '@bitgo/sdk-api';
import { Gteth, Eth } from '@bitgo/sdk-coin-eth';
import minimist from 'minimist';

const params = minimist(process.argv.slice(2), {string: ['r','c']});

const hexData = params['h'];
const tokenContractAddress = params['c'];
const environment  = params['e'] === "prod" ? "prod" : "test";

if(!walletId || !recipient || !amount || !operation || !tokenContractAddress ){
    throw new Error(` 
    Missing required parameters:
    -h: Hex Data
    -c: Token Contract Address
    -e: Environment {test|prod}
    
    Parameters supplied: 
    -h ${hexData}
    -c ${tokenContractAddress}
    -e ${environment}`);
}

const bitgo = new BitGoAPI({
    accessToken: process.env.BITGO_ACCESS_TOKEN,
    env: environment
  });

environment==='prod' ? bitgo.register('eth', Eth.createInstance) : bitgo.register('gteth', Gteth.createInstance);

async function parseHexData() {

    const baseCoin = bitgo.coin('tpolygon');
    const bitGoWallet = await baseCoin.wallets().get({ id: walletId, allTokens: true });

    const decoder = getContractsFactory('eth').getDecoder();

    const parsedHexData = decoder.decode(Buffer.from(hexData));
    console.log("Parsed Data:");
    console.log(JSON.stringify(parsedHexData,2));
}

parseHexData().catch((e) => console.error(e));
import { getContractsFactory } from '@bitgo/smart-contracts';
import { BitGoAPI } from '@bitgo/sdk-api';
import { Gteth, Eth } from '@bitgo/sdk-coin-eth';
import minimist from 'minimist';

const params = minimist(process.argv.slice(2), {string: ['r','c']});

const walletId = params['w'];
const walletPassphrase = params['p'];
const recipient = params['r'];
const amount = Number(params['a']);
const tokenContractAddress = params['c'];
const operation = params['o'];
const environment  = params['e'] === "prod" ? "prod" : "test";

if(!walletId || !recipient || !amount || !operation || !tokenContractAddress ){
    throw new Error(` 
    Missing required parameters:
    -w: Wallet ID
    -p: Wallet Passphrase
    -r: Recipient Address
    -a: Amount
    -c: Token Contract Address
    -o: Operation {build|send}
    -e: Environment {test|prod}
    
    Parameters supplied: 
    -w ${walletId}
    -p ${walletPassphrase}
    -r ${recipient}
    -a ${amount}
    -c ${tokenContractAddress}
    -o ${operation}
    -e ${environment}`);
}

const bitgo = new BitGoAPI({
    accessToken: process.env.BITGO_ACCESS_TOKEN,
    env: environment
  });

environment==='prod' ? bitgo.register('eth', Eth.createInstance) : bitgo.register('gteth', Gteth.createInstance);

async function sendBitGoTx() {

    const baseCoin = bitgo.coin('gteth');
    const bitGoWallet = await baseCoin.wallets().get({ id: walletId, allTokens: true });

    const tokenInstance = getContractsFactory('eth').getContract('StandardERC20').instance();
    tokenInstance.address = tokenContractAddress;

    const calldata = tokenInstance.methods().transfer.call({ _to: recipient, _value: amount})
    const params = {
        recipients: [{
            address: recipient,
            data: calldata.data,
            amount: calldata.amount
        }],
        walletPassphrase: walletPassphrase
    };

    console.log("Prebuild:");
    console.log(params);
    
    const transaction = operation==='build' ? 
        await bitGoWallet.prebuildTransaction(params) : 
        await bitGoWallet.sendMany(params);

    console.log("Transfer:")
    console.log(JSON.stringify(transaction, null, 2));
      
}

sendBitGoTx().catch((e) => console.error(e));
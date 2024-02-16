import minimist from 'minimist';
import { BitGoAPI } from '@bitgo/sdk-api';
import { Btc, Tbtc } from '@bitgo/sdk-coin-btc';
import { networks } from '@bitgo/utxo-lib';



const bitgo = new BitGoAPI({
    accessToken: process.env.BITGO_ACCESS_TOKEN,
    env: 'test',
  });
const walletId = process.env.BITGO_WALLET_ID;
const userXpub = process.env.BITGO_USERKEY_XPUB;
const backupXpub = process.env.BITGO_BACKUPKEY_XPUB;
const bitgoXpub = process.env.BITGO_BITGOKEY_XPUB;
const keychains = [
    {
        pub: userXpub,
    },
    {
        pub: backupXpub
    },
    {
        pub: bitgoXpub
    }
];

bitgo.register('tbtc', Tbtc.createInstance)
const tbtcCoin = bitgo.coin('tbtc');
const btcClass = new Btc(bitgo, networks.testnet);
async function main() {

    const wallet = tbtcCoin.wallets().get({id: walletId});
    const addresses = await (await wallet).addresses();
    //console.log(addresses);

    for(const i in addresses.addresses) {
        const chain = addresses.addresses[i].chain;
        const index = addresses.addresses[i].index;
        const address = addresses.addresses[i].address;

        const expectedAddress = btcClass.generateAddress({
            keychains: keychains,
            threshold: 2,
            chain,
            index,
          });
        
        
        //console.log(address, chain, index);
        //console.log(expectedAddress);
        if (address === expectedAddress.address){
            console.log(`Wallet address: ${address} matches expected address: ${expectedAddress.address}!`)
        } else{
            console.log(`Addresses do not match, derived address: ${expectedAddress.address} for wallet address: ${address}`);
        }
    }

};
main().catch((e) => console.error(e));
  
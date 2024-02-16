/**
 * Recover BTC sent to BCH Address.
 *
 * This tool will help you see how to use the BitGo API to easily share your
 * BitGo wallet with another BitGo user.
 *
 * Copyright 2022, BitGo, Inc.  All Rights Reserved.
 */
import minimist from 'minimist';
import { BitGoAPI } from '@bitgo/sdk-api';
import { Btc, Tbtc } from '@bitgo/sdk-coin-btc';
import { Bch, Tbch } from '@bitgo/sdk-coin-bch';

const params = minimist(process.argv.slice(2));

const walletId = params['w'];
const walletPassphrase = params['p'];
const txnIds = params['t'].split(',');
const address = params['a'];
const env =params['e'] === undefined ? 'test' : params['e'];
const prv = params['k'];

const bitgo = new BitGoAPI({
  accessToken: process.env.BITGO_ACCESS_TOKEN,
  env: env,
});

const btcCoin = env === 'prod' ? 'btc' : 'tbtc';
const bchCoin = env === 'prod' ? 'bch' : 'tbch';

if(env === 'prod'){
  bitgo.register(btcCoin, Btc.createInstance);
  bitgo.register(bchCoin, Bch.createInstance);
} else {
  bitgo.register(btcCoin, Tbtc.createInstance);
  bitgo.register(bchCoin, Tbch.createInstance);
}

const basecoin = bitgo.coin(btcCoin);
const recoverCoin = bitgo.coin(bchCoin);

async function main() {

  let recoveryTxs = [];

  console.log(`Initiating recovery of ${basecoin.getChain()} for: ${txnIds} to address: ${address}`);
  for (const txId of txnIds) {
    try{
      const xprv = prv;
      const recoveryTx = await basecoin.recoverFromWrongChain({
        txid: txId,
        recoveryAddress: address,
        wallet: walletId,
        coin: recoverCoin,
        signed: true,
        walletPassphrase: walletPassphrase,
        prv: xprv
      });

      console.log(`Signed transaction to recover ${txId}: ${recoveryTx}`);
      recoveryTxs.push(recoveryTx);

      recoveryTxs = _.uniqBy(recoveryTxs, 'txHex');
      
    } catch(e) {
      const err = `${e.message}`;
      console.log(`Error processing ${txId}: ${err}`);
    }

  };


};

 main().catch((e) => console.error(e));
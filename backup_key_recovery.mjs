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
import { Eth, Hteth, Gteth } from '@bitgo/sdk-coin-eth';
import { error } from 'console';

const params = minimist(process.argv.slice(2));

const walletId = params['w'];
const walletPassphrase = params['p'];
const userKey = params['u'];
const backupKey = params['b'];
const bitgoKey = params['k'];
const address = params['a'];
const baseAddress = params['ba'];
const coin = params['c'];
const apiKey = params['ak'];
const env =params['e'] === undefined ? 'test' : params['e'];


const bitgo = new BitGoAPI({
  accessToken: process.env.BITGO_ACCESS_TOKEN,
  env: env,
});

let basecoin;

console.log("user key" + userKey);

if(env === 'prod'){
  switch(coin){
    case 'btc':
      bitgo.register(coin, Btc.createInstance);
      basecoin = bitgo.coin(coin);
      break;
    case 'bch':
      bitgo.register(coin, Bch.createInstance);
      basecoin = bitgo.coin(coin);
      break;
    case 'eth':
      bitgo.register(coin, Eth.createInstance);
      basecoin = bitgo.coin(coin);
      break;
    default:
      error('Coin not supported: %d', coin);
  }
} else {
  switch(coin){
    case 'tbtc':
      bitgo.register(coin, Tbtc.createInstance);
      basecoin = bitgo.coin(coin);
      break;
    case 'tbch':
      bitgo.register(coin, Tbch.createInstance);
      basecoin = bitgo.coin(coin);
      break;
    case 'hteth', 'gteth':
      bitgo.register(coin, Hteth.createInstance);
      basecoin = bitgo.coin(coin);
      break;
    case 'gteth':
      bitgo.register(coin, Gteth.createInstance);
      basecoin = bitgo.coin(coin);
      break;
    default:
      error('Coin not supported: %d', coin);
  }
}

async function main() {

  let recoveryTxs = [];

  let recoveryParams = {};

  switch(coin) {
    case 'tbtc', 'btc', 'bch', 'tbch':
      recoveryParams = {
        userKey: userKey,
        backupKey: backupKey,
        bitgoKey: bitgoKey,
        walletPassphrase: walletPassphrase,
        recoveryDestination: address,
        apiKey: apiKey
      };
      break;
    case 'eth', 'hteth', 'gteth':
      recoveryParams = {
        userKey: userKey,
        backupKey: backupKey,
        bitgoKey: bitgoKey,
        walletPassphrase: walletPassphrase,
        recoveryDestination: address,
        walletContractAddress: baseAddress,
        apiKey: apiKey
      };
      break;
      default:
        recoveryParams = {
          userKey: userKey,
          backupKey: backupKey,
          bitgoKey: bitgoKey,
          walletPassphrase: walletPassphrase,
          recoveryDestination: address,
          apiKey: apiKey
        };
  }

  console.log(`Initiating recovery of ${basecoin.getChain()} for: ${walletId} to address: ${address}`);
  try{
    const recoveryTx = await basecoin.recover(recoveryParams);

    console.log(`Signed transaction to recover ${basecoin.getChain()}: ${recoveryTx}`);
    recoveryTxs.push(recoveryTx);

    recoveryTxs = _.uniqBy(recoveryTxs, 'txHex');
    
  } catch(e) {
    const err = `${e.message}`;
    console.log(`Error processing ${basecoin.getChain()} recovery: ${err}`);
  }


};

 main().catch((e) => console.error(e));
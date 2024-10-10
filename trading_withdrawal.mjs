/**
 * Withdraw funds from a BitGo Trading Wallet.
 *
 * This tool will help you see how to use the BitGo API to easily withdraw
 * funds from a BitGo Trading wallet.
 *
 * Copyright 2022, BitGo, Inc.  All Rights Reserved.
 */
import { BitGoAPI } from '@bitgo/sdk-api';
import { coins, CoinFactory } from '@bitgo/sdk-core';
import { coins as coinStatics } from '@bitgo/statics';

const bitgo = new BitGoAPI({
  accessToken: process.env.BITGO_ACCESS_TOKEN,
  env: 'test'
});

const factory = new CoinFactory();
// Build a trading token configuration to work with the desired backing coin

const tbtcConfig = coinStatics.get('tbtc');
const gtethConfig = coinStatics.get('gteth');
const ofcConfig = coinStatics.get('ofctbtc');
const tusdConfig = coinStatics.get('ofctusd');
const tfiatConfig = coinStatics.get('tfiatusd');

const ofcTbtcConfig = {
coin: ofcConfig.name, 
name: ofcConfig.fullName, 
decimalPlaces: ofcConfig.decimalPlaces, 
type: ofcConfig.name,  
backingCoin: tbtcConfig.name, 
isFiat: false
};

const ofcGtethConfig = {
  coin: ofcConfig.name, 
  name: ofcConfig.fullName, 
  decimalPlaces: ofcConfig.decimalPlaces, 
  type: ofcConfig.name,  
  backingCoin: gtethConfig.name, 
  isFiat: false
  };

const ofcTusdConfig = {
  coin: tusdConfig.name, 
  name: tusdConfig.fullName, 
  decimalPlaces: tusdConfig.decimalPlaces, 
  type: tusdConfig.name,  
  backingCoin: tfiatConfig.name, 
  isFiat: true  
}

// Register coins to be used
bitgo.register(ofcTbtcConfig.coin, coins.OfcToken.createTokenConstructor(ofcTbtcConfig));
bitgo.register(ofcTusdConfig.coin, coins.OfcToken.createTokenConstructor(ofcTusdConfig));
bitgo.register(ofcGtethConfig.coin, coins.OfcToken.createTokenConstructor(ofcGtethConfig));
bitgo.register('ofc', coins.Ofc.createInstance);
bitgo.register('ofcusdc', factory.getInstance(bitgo, "usdc"));

const ofcCoin = bitgo.coin('ofc');
const ofcTbtcCoin = bitgo.coin('ofctbtc');
const ofcGtethCoin = bitgo.coin('ofcgteth');
const ofcTusdCoin = bitgo.coin('ofctusd');

// TODO: set the id of the  trading acccount
const walletId = process.env.BITGO_WALLET_ID

// TODO: provide the passphrase for the trading account
const passphrase = 'xxxxxxxx';

async function main() {

  // Search for trading wallet object using the trading account ID
  const wallet = await ofcTusdCoin.wallets().get({ id: walletId });

  // Build Withdrawal Transaction parameters
  const params = {
  recipients: [{
    amount: '1000000',
    address: '9c1e400b427c13fa',
  }],
  walletPassphrase: passphrase,  
  };

  // Initiate Withdrawal Transaction
  const pending = await wallet.sendMany(params);

  // Search for transactions pending approval
  const ptxs = await wallet.transfers({ 
  state: 'pendingApproval'
  })

  console.log(pending);
  console.log(ptxs);
}

main().catch((e) => console.error(e));
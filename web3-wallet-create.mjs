/**
 * Create a multi-sig wallet at BitGo.
 * This makes use of the convenience function generateWallet
 *
 * This tool will help you see how to use the BitGo API to easily create a wallet.
 * In this form, it creates 2 keys on the host which runs this example.
 * It is HIGHLY RECOMMENDED that you GENERATE THE KEYS ON SEPARATE MACHINES for real money wallets!
 *
 * To perform more advanced features, such as encrypting keys yourself, please look at createWalletAdvanced.js
 *
 * Copyright 2022, BitGo, Inc.  All Rights Reserved.
 */

/**
 * Add Low Fee webhook to a wallet.
 *
 * Copyright 2022 BitGo, Inc.  All Rights Reserved.
 */

 import { BitGoAPI } from '@bitgo/sdk-api';
 import { Tpolygon } from '@bitgo/sdk-coin-polygon';
 
 const bitgo = new BitGoAPI({
   accessToken: process.env.BITGO_ACCESS_TOKEN,
   env: 'test', // Change this to env: 'production' when you are ready for production
 });
 
 bitgo.register('tpolygon', Tpolygon.createInstance);
 // Set the coin name to match the blockchain and network
 // btc = bitcoin, tbtc = testnet bitcoin
 const coin = 'tpolygon';

 const basecoin = bitgo.coin(coin);
 
 // TODO: set a label for your new wallet here
 const label = 'Example Test Wallet - ' + Date.now();
 
 // TODO: set your passphrase for your new wallet here
 const passphrase = 'test_wallet_passphrase';
 
 async function main() {
  const start = Date.now();
  console.log(`Wallet starting: ${start}`);
   const response = await basecoin.wallets().generateWallet({
     label,
     passphrase,
     enterprise: 'enterpriseId',
     walletVersion: 3,
     multisigType: 'tss',
   });
 
   const end = Date.now();
   const diff = end - start;
   const { wallet } = response;
   //console.log(`response ID: ${JSON.stringify(response)}`);
   console.log(`Wallet end: ${end}, ${diff}`);
   console.log(`Wallet ID: ${wallet.id()}`);
   console.log(`Wallet Label: ${wallet.label()}`)
   console.log(`Receive address: ${wallet.receiveAddress()}`);
 
   console.log('BACK THIS UP: ');
   console.log(`User keychain encrypted xPrv: ${response.userKeychain.encryptedPrv}`);
   console.log(`Backup keychain xPrv: ${response.backupKeychain.prv}`);
 }

 
 main().catch(e => console.log(e));
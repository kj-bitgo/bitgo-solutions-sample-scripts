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
 import { coins } from '@bitgo/sdk-core';
 
 const bitgo = new BitGoAPI({
   env: 'test', // Change this to env: 'production' when you are ready for production
 });
 
 bitgo.register('ofc', coins.Ofc.createInstance);

 const basecoin =  bitgo.coin("ofc");

 // TODO: set a label for your new wallet here
 const shareId = 'xxxx';
 
 // TODO: set your passphrase for your new wallet here
 const passphrase = 'xxxxxx';
 
 async function main() {
  const auth_res = await bitgo.authenticate({
    username: "salesdemo5@bitgo.com",
    password: passphrase,
    otp: "000000",
  });

  const unlock = await bitgo.unlock({
    otp: "000000",
  });

  const share = await basecoin.wallets().acceptShare({
    walletShareId: shareId,
    userPassword: passphrase
  });
  console.log(share);
 }
 
 main().catch(e => console.log(e));
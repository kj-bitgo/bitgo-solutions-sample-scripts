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
 const label = 'Example Test Wallet - KJ - ' + Date.now();
 
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

  //  const newWallet = await basecoin.wallets().get({id: wallet.id()});

  //  const signedMessage = await newWallet.signMessage({reqId: new RequestTracer(), message: {messageRaw: "data"}, walletPassphrase: passphrase});

  //  console.log(`Message is: ${signedMessage}`);

  //  const transfer = await newWallet.sendMany({
  //   recipients: [{
  //     address: '0xd8e7060B6282d025E3Dff944AD07a7ECb6054449',
  //     amount: '0',
  //     data: '0x3912521500000000000000000000000025966d77ea66307741f18fd2027f571aeadc3c1a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000063dd3822000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000e4f242432a0000000000000000000000003783c7f1f2bfb1f839967ca4bbe9a983d6304fef000000000000000000000000d8e7060b6282d025e3dff944ad07a7ecb60544490000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041deeeefadec7cf5c87cff6f3c90e61194ab95dcd8de7fdc1fb27840b6c63ac09f74214431083423e1a91bac4566ab2da3a9f84f22dcd7e80fc2b95275df7c60291c00000000000000000000000000000000000000000000000000000000000000'
  //   }],
  //   walletPassphrase: 'bitgodemo00'
  //  });

  //  console.log('Transfer created: ' + JSON.stringify(transfer));
 }

//  const newWallet = await basecoin.wallets().get({id: '1233'});
//  const unsigned = await newWallet.sweep({

//  })
//  const halfsigned = await newWallet.signTransaction({
// //   txPrebuild: 'hexdata',
// //   prv
//  })
 
 main().catch(e => console.log(e));
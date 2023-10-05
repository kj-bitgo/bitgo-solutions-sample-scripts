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
import { Btc } from '@bitgo/sdk-coin-btc';
import { randomBytes } from 'crypto';
 
const bitgo = new BitGoAPI({
  env: 'test', // Change this to env: 'production' when you are ready for production
});

const pubkey = process.env.BITGO_SMC_XPUB;
const prvkey = process.env.BITGO_SMC_XPRV;
const key = pubkey ? pubkey : bitgo.decrypt({input: prvkey, password: process.env.BITGO_SMC_PASSWORD});
const seed = randomBytes(12).toString('hex');

bitgo.register('btc', Btc.createInstance);
      
async function main() {

  console.log(`Deriving child key for: ${key}\nWith seed: ${seed}`);

  const derived_key = bitgo.coin('btc').deriveKeyWithSeed({key, seed});

  console.log(derived_key);
}

main().catch(e => console.log(e));
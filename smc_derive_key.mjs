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
 
const bitgo = new BitGoAPI({
  env: 'test', // Change this to env: 'production' when you are ready for production
});

const master_key = 'xpub661MyMwAqRbcG13Y82br56R7kVkuPgyjGNpwpup3pqJV21YReNEZAav8kLX3KBsQSg3v2khbvvQtX4WNHjaiaAJifvcTzKLK7xt2AEyY8GX';
const seed = '0/0';

bitgo.register('btc', Btc.createInstance);
      
async function main() {

  console.log(master_key, seed);

  const derived_key = bitgo.coin('btc').deriveKeyWithSeed({key: master_key, seed: seed});

  console.log(derived_key);
}

main().catch(e => console.log(e));
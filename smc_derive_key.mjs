/**
 * Derive child keys to use as input for SMC wallet.
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
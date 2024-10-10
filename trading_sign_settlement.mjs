/**
 * Sign a payload for settlement
 *
 * Copyright 2023, BitGo, Inc.  All Rights Reserved.
 */

import { BitGoAPI } from '@bitgo/sdk-api';
import { coins } from '@bitgo/sdk-core';

const OFC_WALLET_ID = process.env.OFC_WALLET_ID;
const payload = process.env.PAYLOAD;
const walletPassphrase = process.env.OFC_WALLET_PASSPHRASE;

const bitgo = new BitGoAPI({
  accessToken: process.env.TESTNET_ACCESS_TOKEN,
  env: 'test',
});

const coin = 'ofc';
bitgo.register(coin, coins.Ofc.createInstance);

async function main() {
  const wallet = await bitgo.coin('ofc').wallets().get({ id: OFC_WALLET_ID });

  console.log('Wallet:', wallet);

  const tradingAccount = wallet.toTradingAccount();

  const signature = tradingAccount.signPayload({payload, walletPassphrase});

  console.log('Signature:', signature);
}

main().catch((e) => console.error(e));
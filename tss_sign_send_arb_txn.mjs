/**
 * Withdraw ERC20 Tokens from a BitGo Multisig Wallet.
 *
 * This tool will help you see how to use the BitGo API to easily withdraw
 * ERC20 Tokens from a BitGo Multisig wallet.
 *
 * Copyright 2022, BitGo, Inc.  All Rights Reserved.
 */
import { BitGoAPI } from '@bitgo/sdk-api';
import { Tsol} from '@bitgo/sdk-coin-sol';

const bitgo = new BitGoAPI({
  accessToken: process.env.BITGO_ACCESS_TOKEN,
  env: 'test'
});

bitgo.register('tsol', Tsol.createInstance);

const solCoin = await bitgo.coin('tsol');

// TODO: set the id of the wallet
const walletId = process.env.BITGO_WALLET_ID

// TODO: provide the passphrase for the wallet
const passphrase = 'xxxxxx';

async function main() {

  // Search for trading wallet object using the wallet ID
  const wallet = await solCoin.wallets().get({ id: walletId });
  console.log(wallet);
  const prv = process.env.WALLET_PRV;

  const prebuildParams = {
    type: 'transfer',
    recipients: [{
      address: 'Ckxx8UzqjSaoBJZCeEkWz15TQazC5cZhzQtKH9Z67B7Z' ,
      amount: '0',
      data: 'A9tdDuhG70RHaHYrVFig6hIHo8zur8dNbCnfOIXyprFHf2MBRjxjBMFwWBbGvSOUgIOxjxStn7myldIhCeYV6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHydkkcDTHb2QRZoa7Epeh30Al'
    }]
  };

  const txRequest = await wallet.prebuildTransaction(prebuildParams);
 console.log(txRequest);
  // Build Sign Transaction parameters
  const params = {
      txPrebuild: 
          {
            txRequestId: txRequest.txRequestId,
            txBase64: "A9tdDuhG70RHaHYrVFig6hIHo8zur8dNbCnfOIXyprFHf2MBRjxjBMFwWBbGvSOUgIOxjxStn7myldIhCeYV6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHydkkcDTHb2QRZoa7Epeh30Al",
          },
      prv: prv
  };

  // Initiate Withdrawal Transaction
  const signed = await wallet.signTransaction(params);
  
  console.log(signed);
}

main().catch((e) => console.error(e));
/**
 * Withdraw ERC20 Tokens from a BitGo Multisig Wallet.
 *
 * This tool will help you see how to use the BitGo API to easily withdraw
 * ERC20 Tokens from a BitGo Multisig wallet.
 *
 * Copyright 2022, BitGo, Inc.  All Rights Reserved.
 */
import { BitGoAPI } from '@bitgo/sdk-api';
import { Gteth, Erc20Token } from '@bitgo/sdk-coin-eth';
import { Polygon, PolygonToken } from '@bitgo/sdk-coin-polygon';

const bitgo = new BitGoAPI({
  accessToken: process.env.BITGO_ACCESS_TOKEN,
  env: 'test'
});

bitgo.register('polygon', Polygon.createInstance);
PolygonToken.createTokenConstructors().forEach(({name, coinConstructor}) => {
  bitgo.register(name, coinConstructor);
});

const polygon = bitgo.coin('polygon');
const usdcPoly = bitgo.coin('polygon:usdcv2');

const wallet = await polygon.wallets().get({ id: walletId });
const usdcWalletObj = usdcPoly.wallets().get({ id: walletId });

wallet.createAddress();
usdcPoly.sendMany();

// TODO: set the id of the wallet
const walletId = process.env.BITGO_WALLET_ID

// TODO: provide the passphrase for the wallet
const passphrase = 'xxxxxx';

async function main() {

  // Search for trading wallet object using the wallet ID
  const wallet = await usdcPoly.wallets().get({ id: walletId });

  // Build Withdrawal Transaction parameters
  const params = {
  recipients: [{
    amount: '1000000',
    address: '0xd8e7060B6282d025E3Dff944AD07a7ECb6054449',
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
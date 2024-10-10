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

const bitgo = new BitGoAPI({
  accessToken: process.env.BITGO_ACCESS_TOKEN,
  env: 'test'
});

bitgo.register('gteth', Gteth.createInstance);
Erc20Token.createTokenConstructors().forEach(({name, coinConstructor}) => {
  if(name==='gterc6dp'){
    bitgo.register(name, coinConstructor);
  }
});

const ethCoin = bitgo.coin('gteth');
const usdtToken = bitgo.coin('gterc6dp');

// TODO: set the id of the wallet
const walletId = process.env.BITGO_WALLET_ID

// TODO: provide the passphrase for the wallet
const passphrase = process.env.BITGO_WALLET_PASSPHRASE;

async function main() {

  // Search for trading wallet object using the wallet ID
  const wallet = await usdtToken.wallets().get({ id: walletId });

  // Build Withdrawal Transaction parameters
  const params = {
  recipients: [{
    address: '0xe7aFA17e6E5257806d2309B01E6DE320668Ec3DC',
    amount: '0',
    data: '0x1140fabd0000000000000000000000000000000000000000000000000000000000989680'
  }],
  type: 'transfer',
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
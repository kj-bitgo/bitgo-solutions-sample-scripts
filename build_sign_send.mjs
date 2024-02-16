/**
 * Withdraw funds from a BitGo Trading Wallet.
 *
 * This tool will help you see how to use the BitGo API to easily withdraw
 * funds from a BitGo Trading wallet.
 *
 * Copyright 2022, BitGo, Inc.  All Rights Reserved.
 */
import { BitGoAPI } from '@bitgo/sdk-api';
import { Btc, Tbtc } from '@bitgo/sdk-coin-btc';

const bitgo = new BitGoAPI({
  accessToken: process.env.BITGO_ACCESS_TOKEN,
  env: 'test'
});

// Register coins to be used
bitgo.register('tbtc', Tbtc.createInstance);
bitgo.register('btc', Btc.createInstance);


const tbtcCoin = bitgo.coin('tbtc');
const btcCoin = bitgo.coin('btc');
// TODO: set the id of the  trading acccount
const walletId = process.env.BITGO_WALLET_ID;
const address = process.env.BITGO_WITHDRAW_ADDRESS;
const prv = process.env.BITGO_PRV;

// TODO: provide the passphrase for the trading account
const passphrase = process.env.BITGO_WALLET_PASSPHRASE;

async function main() {

  // Search for trading wallet object using the trading account ID
  const wallet = await tbtcCoin.wallets().get({ id: walletId });

  const feeEstimate = await tbtcCoin.feeEstimate({amount: amount, recipient: address});

  //const clientKey = await wallet.getPrv();

  // Build Withdrawal Transaction parameters
  const buildParams = {
  recipients: [{
    amount: '1000000',
    address: address,
  }],
  walletPassphrase: passphrase,
  feeRate: feeEstimate.feePerKb
  };

  console.log(buildParams);
  // Build Withdrawal Transaction
  const txPreBuild = await wallet.prebuildTransaction(buildParams);

  console.log(txPreBuild);

  const txPrebuild_presigned = await wallet.prebuildAndSignTransaction(buildParams);

  console.log(txPrebuild_presigned);

  const keychains = await wallet.getEncryptedUserKeychain();
  
  const signParams = {
    txPrebuild: txPreBuild,
    keychain: keychains,
    walletPassphrase: passphrase
  };

  console.log(signParams);

  const txHalfSigned = await wallet.signTransaction(signParams);

  console.log(txHalfSigned);

  const pending = await wallet.submitTransaction(txHalfSigned);

  console.log(pending);

  if (pending.pendingApproval != undefined){
    // Search for transactions pending approval
    const ptxs = await wallet.transfers({state: 'pendingApproval'});
    const pending_transfer = ptxs.transfers.find((transfer) => {
      //console.log(transfer.pendingApproval);
      return transfer.pendingApproval === pending.pendingApproval.id
    });
    console.log(pending_transfer);
  }

  const pendingApproval_obj = await bitgo.coin('tbtc').pendingApprovals().get({id: pending.pendingApproval.id});
  const approved = await pendingApproval_obj.approve({otp: otp});

  console.log(pendingApproval_obj);
}

main().catch((e) => console.error(e));
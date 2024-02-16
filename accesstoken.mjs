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
 
 const bitgo = new BitGoAPI({
   env: 'test', // Change this to env: 'production' when you are ready for production
 });
 
 async function main() {
  const auth_res = await bitgo.authenticate({
    username: process.env.BITGO_USERNAME,
    password: process.env.BITGO_PASSWORD,
    otp: "000000",
  });

  const accesstokens = await bitgo.listAccessTokens();
  console.log(JSON.stringify(accesstokens));
  console.log()

  const access_token = await bitgo.addAccessToken({
    otp: "000000",
    label: "Admin Access Token",
    scope: [
      "openid",
      "portfolio_view",
      "trade_view",
      "wallet_view_all",
    ],
    // Optional: Set a spending limit.
    spendingLimits: [
      {
        coin: "tbtc",
        txValueLimit: "1000000000", // 10 TBTC (10 * 1e8)
      },
    ],

    
  });
  console.log(access_token);
  const removed = await bitgo.removeAccessToken({id: access_token.id,});
 }
 
 main().catch(e => console.log(e));
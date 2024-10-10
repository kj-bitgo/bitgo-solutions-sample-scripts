/**
 * Withdraw ERC20 Tokens from a BitGo Multisig Wallet.
 *
 * This tool will help you see how to use the BitGo API to easily withdraw
 * ERC20 Tokens from a BitGo Multisig wallet.
 *
 * Copyright 2022, BitGo, Inc.  All Rights Reserved.
 */
import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';
import { BitGoAPI } from '@bitgo/sdk-api';
import { coins } from '@bitgo/sdk-core';

const accessToken = process.env.BITGO_ACCESS_TOKEN;
const bitgo = new BitGoAPI({
  accessToken: accessToken,
  env: 'test'
});

bitgo.register('ofc', coins.Ofc.createInstance);

// TODO: set the id of the wallet
const goAccount = process.env.BITGO_GO_ACCOUNT_ID

async function main() {
 
  const csvFilePath = path.resolve('whitelist.csv');

  const fileHeaders = ['name', 'address'];

  const wallet = await bitgo.coin('ofc').wallets().get({ id: goAccount });

  fs.createReadStream(csvFilePath, { encoding: 'utf-8' })
  .pipe(parse({delimiter: ',', from_line: 2}))
  .on("data", function(row) {

    console.log(`Setting new whitelist policy on wallet ${wallet.label()}`);
    const policy = {
                action: {
                type: 'deny'
      },
      condition: {
                add: {
                item: row[1],
                type: 'address',
                metaData: {
                  label: row[0]
                },
                coin: 'tbtc'
              },
      },
      id: 'Offchain Wallet Whitelist',
      type: 'advancedWhitelist'
    };

    const result = wallet.setPolicyRule(policy);
    console.dir(result);
  });

}

main().catch((e) => console.error(e));
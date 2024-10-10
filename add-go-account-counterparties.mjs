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
import axios from "axios";


const accessToken = process.env.BITGO_ACCESS_TOKEN;
const url = 'https://app.bitgo-test.com/api/address-book/v1/connections'
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + accessToken,
}

// TODO: set the id of the wallet
const goAccount = process.env.BITGO_GO_ACCOUNT_ID

async function main() {

  const listingEntry = (await axios.get('https://app.bitgo-test.com/api/address-book/v1/listing/global', {headers: headers})).data;
 
  const csvFilePath = path.resolve('counterparties.csv');
  
  const fileHeaders = ['name', 'walletId'];
  
  fs.createReadStream(csvFilePath, { encoding: 'utf-8' })
  .pipe(parse({delimiter: ',', from_line: 2}))
  .on("data", function(row) {
    console.log(row);
    let data = {
      'listingEntryId': listingEntry.listingEntries[0].id,
      'walletId': row[1],
      'localListingName': row[0]
    }
    let response = axios.post(url, data, {headers: headers});
    console.log(response);
  });

}

main().catch((e) => console.error(e));
// ./examples/londonTx.ts

import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import ethwallet from 'ethereumjs-wallet';

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London });
const wallet = ethwallet.fromExtendedPrivateKey(process.env.BITGO_BACKUP_XPRV);
console.log(wallet.getAddressString());
const txData = {
  gasLimit: 20000,
  maxPriorityFeePerGas: 10 ,
  maxFeePerGas: 255,
  nonce: 1 ,
  to: '0xcccccccccccccccccccccccccccccccccccccccc',
  value: 1000000000000000,
  chainId: 1,
}

const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common })
const signedTx = tx.sign(wallet.getPrivateKey());
console.log(signedTx.hash());
console.log(bytesToHex(signedTx.hash())); // 0x6f9ef69ccb1de1aea64e511efd6542541008ced321887937c95b03779358ec8a
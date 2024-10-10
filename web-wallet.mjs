import { BitGoAPI } from '@bitgo/sdk-api';
import { Tpolygon } from '@bitgo/sdk-coin-polygon';

const bitgo = new BitGoAPI({ env: 'test' });
const config = {
		username: process.env.BITGO_USERNAME,
		password:process.env.BITGO_PASSWORD,
		otp: "000000",
};

async function createHotWalletSimple() {
	const newWallet = await bitgo.coin('tpolygon').wallets().generateWallet({
		label: 'My Test Wallet',
		passphrase: 'secretpassphrase',
		enterprise: 'enterprise id',
		walletVersion: 3,
		multisigType: 'tss',
	}).catch((error) => {
		console.error("generateWallet Error\nStatus:", error.status, "\nResult:", error.result);
	});

    if(newWallet)
		console.log(newWallet);
}

(async function main(){
	bitgo.register('tpolygon', Tpolygon.createInstance);
	const auth_res = await bitgo.authenticate(config).catch((error) => {
		console.error("BitGo API authentication error:", error);
	});
	createHotWalletSimple();
})()

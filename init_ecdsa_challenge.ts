import { BitGo, Enterprise, RequestTracer } from 'bitgo';
import { EcdsaTypes, EcdsaRangeProof } from '@bitgo/sdk-lib-mpc';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
const arg = process.argv.slice(2).length? process.argv.slice(2)[0] : 'getWallet';

const username = process.env.username!
const password = process.env.password!
const enterpriseId = process.env.enterpriseId!;
const env = process.env.bitgoEnv! as any;
const customRootURI = process.env.customRootURI;
const walletId = process.env.walletId!;
const receiveAddress = process.env.receiveAddress!;
const faucetAddress = "0x865bc85d9d6ba0b3d6ffacf1aca6aaa17837624d";

const sdk = new BitGo({
	env,
    customRootURI,
});

const baseCoin = sdk.coin('gteth');

async function initializeEcdsaOnEnterprise() {
	const enterprise = new Enterprise(sdk, baseCoin, {id: enterpriseId, name: 'Harbor Caapital'})
	const verifyBitGoProofsSignatures = await enterprise.verifyEcdsaBitGoChallengeProofs(password);
	// console.log(JSON.stringify(verifyBitGoProofsSignatures));
	const challenge = await EcdsaRangeProof.generateNtilde(3072);
	// console.log(JSON.stringify(EcdsaTypes.serializeNtilde(challenge)));
	const res = await enterprise.uploadAndEnableTssEcdsaSigning(
		password,
		verifyBitGoProofsSignatures.bitgoInstHsmAdminSignature,
		verifyBitGoProofsSignatures.bitgoNitroHsmAdminSignature,
		challenge,
	);
	// console.log(JSON.stringify(res));
}

async function createWallet() {
    const wallet = await baseCoin.wallets().generateWallet({
        label: 'My Test Wallet',
        passphrase: password,
        enterprise: enterpriseId,
        walletVersion: 3,
        multisigType: 'tss',
    });
    console.log('Wallet ID:', wallet.wallet.id());
	console.log(wallet.wallet.toJSON());
}

async function getWallet() {
	const walletInstance = await baseCoin.wallets().get({ id: walletId });
	console.log(`balance ${walletInstance.balanceString()}`);
	console.log(`\nReceive address: ${walletInstance.receiveAddress()}`);
	console.log(walletInstance.toJSON());
}
async function auth() {
	await sdk.authenticate({
		username,
		password,
		otp: "000000",
	});
	await sdk.unlock({ otp: "000000", duration: 3600 });
}

async function signMessage() {
	const walletInstance = await baseCoin.wallets().get({ id: walletId });
  	console.log(`\nReceive address: ${walletInstance.receiveAddress()}`);
  	const messageRaw = 'test message';
	const reqId = new RequestTracer();
	console.log(`requestId ${reqId.toString()}`);
  	const result = await walletInstance.signMessage({
    	message: { messageRaw },
    	reqId,
    	walletPassphrase: password,
    	// isTss: true,
  	});
  console.log('result: ', result);
}

async function broadcastTransaction() {
	await sdk.authenticate({
		username,
		password,
		otp: "000000",
	});
	await sdk.unlock({ otp: "000000", duration: 3600 });
	console.log("unlocked");
	const walletInstance = await baseCoin.wallets().get({ id: walletId });
	const reqId = new RequestTracer();
	console.log(`\nReceive address: ${walletInstance.receiveAddress()}`);
	console.log(`requestId ${reqId.toString()}`);
  	const result = await walletInstance.prebuildAndSignTransaction({
		reqId,
		recipients: [
			{
			address: faucetAddress,
			amount: '1',
			// tokenName: 'gteth',
			}
			],
		type: 'transfer',
		isTss: true,
		walletPassphrase: password,
  	});
  console.log('result: ', result);
}

async function time(fn: () => Promise<void>, name: string) {
	await auth();
	const start = Date.now();

	await fn().catch((e) => console.error(e));
	const end = Date.now();
	console.log(`\n${name} took ${end - start}ms (${(end - start)/1000}s)\n`);
}

async function timeWithLoop(fn: () => Promise<void>, name: string, iterations = 200) {
	const startGlobal = Date.now();
	for (let i = 0; i < iterations; i++) {
		time(fn, name);
	}
	const globalEnd = Date.now();
	console.log(`\n global ${name} over 200 iterations took ${globalEnd - startGlobal}ms (${(globalEnd - startGlobal)/1000}s)\n`);
}

if (arg === 'createWallet') {
	time(createWallet, 'createWallet').catch((e) => console.error(e));
} else if (arg === 'getWallet') {
	time(getWallet, 'getWallet').catch((e) => console.error(e));
} else if (arg === 'initializeEcdsaOnEnterprise') {
	time(initializeEcdsaOnEnterprise, 'initializeEcdsaOnEnterprise').catch((e) => console.error(e));
} else if (arg === 'signMessage') {
	time(signMessage, 'signMessage').catch((e) => console.error(e));
} else if (arg === 'broadcastTransaction') {
	time(broadcastTransaction, 'broadcastTransaction').catch((e) => console.error(e));
}
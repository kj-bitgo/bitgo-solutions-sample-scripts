import WebSocket from 'ws';

const baseURL = 'wss://app.bitgo-test.com/api/prime/trading/v1/ws'

async function main() {

    let socket = new WebSocket(baseURL, {
        headers: {
            Authorization: 'Bearer xxxxxx'
        }
    });

    socket.onopen = (event) =>{
        console.log("Websocket connection established.");
        const msg = {
            type: 'subscribe',
            accountId: '5ef523b7ab6b7f7b00b9513a0ac0a4e8',
            channel: 'level2',
            productId: 'TBTC-TUSD*'
        }
        socket.send(JSON.stringify(msg));
    };

    socket.onmessage = (event) => {
        console.log(event.data);
    };
};

main().catch(e => console.log(e));
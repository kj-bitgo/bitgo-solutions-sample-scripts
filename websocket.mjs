import WebSocket from 'ws';

const baseURL = 'wss://app.bitgo-test.com/api/prime/trading/v1/ws'

async function main() {

    let socket = new WebSocket(baseURL, {
        headers: {
            Authorization: `Bearer ${process.env.BITGO_ACCESS_TOKEN}`
        }
    });

    socket.onopen = (event) =>{
        console.log("Websocket connection established.");
        const msg = {
            "type": "subscribe",
            "channel": "orders",
            "accountId": process.env.BITGO_TRADE_ACCOUNT
        }
        socket.send(JSON.stringify(msg));
    };

    socket.onmessage = (event) => {
        console.log(event.data);
    };
};

main().catch(e => console.log(e));
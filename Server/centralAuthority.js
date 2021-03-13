
//This file contains the code for the central authority of Bindr.
"use strict"

let ws = require("ws");

const wss = new WebSocket.Server({port: 8080});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    ws.send('something');
});
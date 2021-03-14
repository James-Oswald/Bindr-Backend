
//This file contains the code for the central authority of Bindr.
"use strict"

let WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8080});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        try{
            let obj = JSON.parse(message);
            ws.send(JSON.stringify({"c":obj.a+obj.b}));
        }catch(e){
            console.log(e.message);
            ws.send(JSON.stringify({"c":e.message}));
        }
    });
    console.log("recived connection");
});
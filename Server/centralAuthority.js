
//This file contains the code for the central authority of Bindr.
"use strict"

let WebSocket = require("ws");

//=============== Application State =========================
const wss = new WebSocket.Server({port: 8080}); //The websocket Server

init();

//Initilization function, run at startup
function init(){
    wss.on('connection', onConnection);
}

function onConnection(websocket){
    websocket.on('message', message=>onMessage(websocket, message));
    websocket.on('close', (code,reason)=>onClose(websocket, code, reason));
}

function onMessage(websocket, message){
    try{
        dispatch(websocket, message)
    }catch(e){
        console.log(e.message);
    }
}

function dispatch(websocket, message){
    try{
        let obj = JSON.parse(message);
        websocket.send(JSON.stringify({"retMsg":obj.enc}));
    }catch(e){
        console.log(e.message);
        websocket.send(JSON.stringify({"retMsg":e.message}));
    }
}

function onClose(){
    
}



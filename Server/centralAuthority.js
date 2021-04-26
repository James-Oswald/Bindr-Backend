
//This file contains the code for the central authority of Bindr.
"use strict"

let WebSocket = require("ws");

class Session{
    constructor(documentID, websocket){
        this.id = documentID;
        this.users = [websocket];
        this.documentHistory = [];
    }
}

//dictionary of sessions indexed by document ID
let sessions = {};

//=============== Application State =========================
const wss = new WebSocket.Server({port: 8080}); //The websocket Server

init();

//Initilization function, run at startup
function init(){
    wss.on('connection', onConnection);
}

function onConnection(websocket, request){
    try{
        let connectionParams = new URL("http://meme.com" + request.url).searchParams;
        let documentId = connectionParams.get("doc");
        //let user = connectionParams.get("doc");
        if(sessions[documentId] == undefined)   //if the user has yet to connect
            sessions[documentId] = new Session(documentId, websocket)
        else{ //someone is already connected, we add ourselves to the session
            sessions[documentId].users.push(websocket);
            let loadMessage = {
                id: 0,
                type: "load",
                edits: sessions[documentId].documentHistory
            }
            websocket.send(JSON.stringify(loadMessage));
        }
        let thisSession = sessions[documentId];
        websocket.on('message', message=>onMessage(websocket, message, thisSession));
        websocket.on('close', (code,reason)=>onClose(thisSession));
        
        console.log("connection sucsessful");
    }catch(e){
        console.log(e);
    }
}

function onMessage(websocket, message, session){
    let messageObject = JSON.parse(message);
    try{
        dispatch(messageObject, session);
    }catch(e){
        console.log(e);
        websocket.send(JSON.stringify({"id": messageObject.id, "error":e.message}));
    }
}

function dispatch(messageObject, session){
    console.log(messageObject);
    switch(messageObject.type){
        case "edit":   //just forwards it to all connections
            session.documentHistory.push(messageObject.msg)
            for(let user of session.users)
                user.send(JSON.stringify(messageObject));
            break;
        default:
            throw new Error("Invalid message type");
    }
}

function onClose(thisSession){

}



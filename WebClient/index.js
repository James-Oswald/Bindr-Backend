
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', function(event){
    console.log("Server Connect")
});

socket.addEventListener('message', function (event) {
    console.log(event.data)
    decObj = atob(JSON.parse(event.data).retMsg);
    document.getElementById("out").innerHTML += decObj + "<br/>";
});

let counter = 0;
let counter2 = 0;

function send(){
    counter++;
    counter2+=10;
    obj = {"a":counter, "b":counter2};
    encObj = btoa(JSON.stringify(obj));
    socket.send(JSON.stringify({"enc":encObj}));
}

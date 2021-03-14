
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', function (event) {
    console.log("Server Connect")
});

socket.addEventListener('message', function (event) {
    document.getElementById("out").innerHTML += event.data + "<br/>";
});

let counter = 0;
let counter2 = 0;
function send(){
    counter++;
    counter2+=10;
    obj = {"a":counter, "b":counter2};
    socket.send(JSON.stringify(obj));
}

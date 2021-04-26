
const socket = new WebSocket('ws://localhost:8080?doc="a"');
let messageTable = {}

//we generate this in place of a real user system
userId = Math.random().toString(36).substring(7);

socket.addEventListener('open', function(event){
    console.log("Server Connect");
});

socket.addEventListener('message', function (event) {

    let messageObject = JSON.parse(event.data);
    console.log(messageObject);
    if(messageTable[messageObject.id] != undefined)
        delete messageTable[messageObject.id];
    else{   //This is a request from another user
        let editArea = document.getElementById("editArea");
        switch(messageObject.type){
            case "edit":
                let editObject = JSON.parse(CryptoJS.AES.decrypt(messageObject.msg, "password").toString(CryptoJS.enc.Utf8));
                console.log(editObject);
                if(editObject.act == 1)
                    editArea.value = editArea.value.substring(0, editObject.pos) + editObject.val + editArea.value.substring(editObject.pos, editArea.value.length);
                else if(editObject.act == 0)
                    editArea.value = editArea.value.substring(0, editObject.pos) + editArea.value.substring(editObject.pos + 1, editArea.value.length);
                else
                    console.log("invalid edit action");
                editText = editArea.value;
                break;
            case "load":
                for(let encryptedEdit of messageObject.edits){
                    let editObject = JSON.parse(CryptoJS.AES.decrypt(encryptedEdit, "password").toString(CryptoJS.enc.Utf8));
                    console.log(editObject);
                    if(editObject.act == 1)
                        editArea.value = editArea.value.substring(0, editObject.pos) + editObject.val + editArea.value.substring(editObject.pos, editArea.value.length);
                    else if(editObject.act == 0)
                        editArea.value = editArea.value.substring(0, editObject.pos) + editArea.value.substring(editObject.pos + 1, editArea.value.length);
                    else
                        console.log("invalid edit action");
                }
                editText = editArea.value;
                break;
            default:
                console.log("invalid message type recived")
        }
    }
});

editText = "";
messageNumber = 0;
function onEdit(element){
    let editType = null;
    let editValue = null;
    let editPosition = null;
    if(element.selectionEnd != element.selectionStart){ //we force no selection
        element.value = editText;
        return;
    }
    //var lastInput = getInputedString(editText, element.value, element.selectionEnd);
    if(editText.length > element.value.length){
        editType = 0; //delete
        editPosition = element.selectionEnd;
        editValue = 1; 
    }else{
        editType = 1; //add
        editPosition = element.selectionEnd - 1;
        editValue = element.value[element.selectionEnd - 1];
    }
    editText = element.value;
    editMessage = {
        user: userId,
        time: Date.now(),
        act: editType,
        pos: editPosition,
        val: editValue
    };
    console.log(editMessage);
    let encryptedEdit = CryptoJS.AES.encrypt(JSON.stringify(editMessage), "password").toString();
    messageId = userId + messageNumber++;
    message = {
        id: messageId,
        type: "edit",
        msg: encryptedEdit
    };
    socket.send(JSON.stringify(message));
    messageTable[messageId] = "";
    //send input
}

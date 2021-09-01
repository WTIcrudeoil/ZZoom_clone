const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room")

const msgForm = document.getElementById("msgs");

let roomName;

room.hidden=true;


function addMessage(message){
    
    const ul = room.querySelector("ul");
    const li = document.createElement("li")
    li.innerText = message;
    ul.appendChild(li);
    
}

function handleMessageSubmit(e){
    e.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("new_message",input.value,roomName,()=>{
        addMessage(`You: ${value}`);
    });
    input.value="";
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`
    const form = room.querySelector("form");
    form.addEventListener("submit",handleMessageSubmit)
}

function handleRoomSubmit(e){
    e.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room",input.value,showRoom)
    roomName = input.value;
    input.value= "";
}

form.addEventListener("submit",handleRoomSubmit);

socket.on("welcome",()=>{ 
        addMessage("someone joined!")});

socket.on("bye",()=>{
    addMessage("someone left");
})

socket.on("new_message",addMessage)

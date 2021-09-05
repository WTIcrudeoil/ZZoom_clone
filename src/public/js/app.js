const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room")
const nameForm = welcome.querySelector("#name")

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
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message",input.value,roomName,()=>{
        addMessage(`You: ${value}`);
    });
    input.value="";
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = nameForm.querySelector("input");
    socket.emit("nickname",input.value);
    console.log(input.value);
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit",handleMessageSubmit)

}

function handleRoomSubmit(e){
    e.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room",input.value,showRoom)
    roomName = input.value;
    input.value= "";
}

form.addEventListener("submit",handleRoomSubmit);
nameForm.addEventListener("submit",handleNicknameSubmit)

socket.on("welcome",(user,newCount)=>{ 
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${user} joined!`)});

socket.on("bye",(left,newCount)=>{
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${left} left xD`);
})

socket.on("new_message",addMessage);

socket.on("room_change",(rooms) =>{
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML ="";
    if(rooms.length===0){
        return;
    }
    rooms.forEach(rooom=>{
        const li = document.createElement("li");
        li.innerText = rooom;
        roomList.appendChild(li);
    });
});
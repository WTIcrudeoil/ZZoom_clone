const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#nick");
const messageForm = document.querySelector("#msg");

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type,payload){
    const msg ={type,payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open",()=>{
    console.log("Connected to Server✅");
});

socket.addEventListener("message",(message)=>{

});

socket.addEventListener("close",()=>{
    console.log("Disconnected from Server❌")
})

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message",input.value));
    const li = document.createElement("li");
    li.innerText = `You : ${input.value.toString("utf8")}`;
    messageList.append(li);
    input.value = "";

}

function handleNickSubmit(e){
    e.preventDefault();
    const input = nicknameForm.querySelector("input");
    socket.send(makeMessage("nickname",input.value));
    input.value="";
}

messageForm.addEventListener("submit",handleSubmit);
nicknameForm.addEventListener("submit",handleNickSubmit);
// setTimeout(()=>{
//     socket.send("hello from the browser!");
// },1000)
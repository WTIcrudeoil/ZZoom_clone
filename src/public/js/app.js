const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff =false;

async function getCameras(){
    try{    
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput")
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach(el => {
            const option = document.createElement("option")
            option.value = el.deviceId;
            option.innerText = el.label;
            if(currentCamera.label == el.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
    }catch(e){
        console.log(e);
    }
}

async function getMedia(deviceId){
    const initialConstrains = {
        audio:true,
        video:{facingMode:"user"},
    };
    const cameraConstrains = {
        audio:true,
        video:{deviceId:{exact:deviceId}},
    };
    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstrains : initialConstrains
        );
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }
        
    } catch(e){
        console.log(e);
    }
}

function handleMuteClick(){
    myStream.getAudioTracks().forEach( (track) => (track.enabled = !track.enabled));
    console.log(myStream.getAudioTracks());
    if(!muted){
        muteBtn.innerText = "Unmute"
        muted = true;
    } else{
        muteBtn.innerText= 'Mute'
        muted = false;
    }
}

function handleCameraClick(){
    myStream.getVideoTracks().forEach( (track) => (track.enabled = !track.enabled));
    console.log(myStream.getVideoTracks());
    if(cameraOff){
        cameraBtn.innerText = "Turn camera Off";
        cameraOff =false;
    } else{
        cameraBtn.innerText = "Turn camera On";
        cameraOff =true;
    }
}

async function handleCameraChange(){
    await getMedia(camerasSelect.value)
    console.log(camerasSelect.value);
}

getMedia();
muteBtn.addEventListener("click",handleMuteClick)
cameraBtn.addEventListener("click",handleCameraClick)
camerasSelect.addEventListener("input",handleCameraChange);
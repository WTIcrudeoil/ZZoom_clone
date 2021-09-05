import express from "express";
import {Server} from "socket.io";
import http from "http";
import {instrument} from "@socket.io/admin-ui";


const app = express();

app.set("view engine","pug");
app.set("views", __dirname +"/views");
app.use("/public",express.static(__dirname+"/public"));
console.log("hi")

app.get("/",(req,res) => res.render("home"))
app.get("/*",(req,res)=>res.redirect("/"))

const handleListen = () => console.log(`Listening on http://localhost:3000`);
//app.listen(3000,handleListen);

const server = http.createServer(app);

const wsServer = new Server(server,{
    cors:{
        origin:["https://admin.socket.io"],
        credentials:true,
    }
});

instrument(wsServer,{
    auth:false
});

function publicRooms(){
    const sids = wsServer.sockets.adapter.sids;
    const rooms = wsServer.sockets.adapter.rooms;
    const publicRooms = [];
    rooms.forEach((_,key)=>{
        if(sids.get(key) === undefined){
            publicRooms.push(key)
        }
    })
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection",(socket) =>{
    socket["nickname"]="Anon"

    socket.onAny((event)=>{
        console.log(wsServer.sockets.adapter);
        console.log(`socket Event:${event}`);
    });
    socket.on("enter_room",(roomName,done)=>{
        socket.join(roomName);
    
        done();
        socket.to(roomName).emit("welcome",socket.nickname,countRoom(roomName));
        wsServer.sockets.emit("room_change",publicRooms());
    });
    socket.on("disconnecting",()=>{
        socket.rooms.forEach(room => socket.to(room).emit("bye",socket.nickname,countRoom(room)-1));
    });
    socket.on("disconnect",()=>{
        wsServer.sockets.emit("room_change",publicRooms());
    });
    socket.on("new_message",(msg,room,done)=>{
        socket.to(room).emit("new_message",`${socket.nickname} : ${msg}`);
        done();//이 코드는 서버단에서 실행되지않음
    })
    socket.on("nickname",nickname => (socket["nickname"]=nickname))
})

//const wss = new WebSocket.Server({server});

//const sockets = [];

// wss.on("connection",(socket)=>{
//     //console.log(socket);
//     sockets.push(socket);
//     socket["nickname"] ="Anon"; //nickname for anonyous user
//     console.log("Connected to Browser✅");
//     socket.on("close",()=> console.log("Disconnect from the Browser❌"))
//     socket.on("message",(msg)=>{
//         const message = JSON.parse(msg);
//         switch(message.type){
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${message.payload.toString("utf8")}`));
//             case "nickname":
//                 socket["nickname"]=message.payload
//         }
//         /*
//         if(parsed.type === "new_message"){

//             sockets.forEach(aSocket => aSocket.send(parsed.payload.toString("utf8")));
//         } else if(parsed.type === "nickname"){
//             console.log(parsed.payload);
//         }
//         */
//     });
// });

server.listen(3000,handleListen);
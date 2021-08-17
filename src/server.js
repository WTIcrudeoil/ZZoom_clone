import express from "express";
import http from "http";
import WebSocket from "ws";

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
const wss = new WebSocket.Server({server});

const sockets = [];

wss.on("connection",(socket)=>{
    //console.log(socket);
    sockets.push(socket);
    socket["nickname"] ="Anon"; //nickname for anonyous user
    console.log("Connected to Browser✅");
    socket.on("close",()=> console.log("Disconnect from the Browser❌"))
    socket.on("message",(msg)=>{
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${message.payload.toString("utf8")}`));
            case "nickname":
                socket["nickname"]=message.payload
        }
        /*
        if(parsed.type === "new_message"){

            sockets.forEach(aSocket => aSocket.send(parsed.payload.toString("utf8")));
        } else if(parsed.type === "nickname"){
            console.log(parsed.payload);
        }
        */
    });
});

server.listen(3000,handleListen);
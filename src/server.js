import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
//view engine으로 pug를 설정
app.set("views", __dirname + "/views");
//express에 탬플릿이 어디있는지 지정해줌
app.use("/public", express.static(__dirname + "/public"));
//public url을 만들어서 유저에게 파일을 보여줌
app.get("/", (req, res) => res.render("home"));
//home.pug를 rendering해주는 라우트핸들러를 만들었음.
app.get("/*", (req, res) => res.redirect("/"));
//다른 링크로 가려고 하면 홈으로 돌려보냄

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);
//http server
const wsServer = new Server(httpServer);
//websoket server

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });
  socket.on("new_message", (msg, roomName, done) => {
    socket.to(roomName).emit("new_message", msg);
    done();
  });
});

/*
function onSocketClose() {
    console.log("Disconnected from Browser❌");
}

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "anonymous";
    console.log("connected to Browser✅");
    socket.on("close", onSocketClose);
    socket.on("message", (message) => {
        const convertedToStringMsg = message.toString("utf8");
        const parsed = JSON.parse(convertedToStringMsg);
        switch (parsed.type) {
            case "new_message":
                sockets.forEach((aSocket) =>
                aSocket.send(`${socket.nickname}: ${parsed.payload}`)
                );
                break;
                case "nickname":
                    socket["nickname"] = parsed.payload;
                    break;
                }
            });
        });
        //백엔드의 소켓은 연결된 브라우저를 뜻한다
        */
const handleListen = () =>
  console.log(`✅✅✅Listening on http://localhost:${PORT} 🤖🤖🤖`);

httpServer.listen(PORT, handleListen);

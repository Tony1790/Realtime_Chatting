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

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event:${event}`);
  });
  socket["nickname"] = "Anonymous";
  socket.on("enter_room", (roomName, NicknameInputValue, done) => {
    socket["nickname"] = NicknameInputValue;
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, roomName, done) => {
    socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
});

const handleListen = () =>
  console.log(`✅✅✅Listening on http://localhost:${PORT} 🤖🤖🤖`);

httpServer.listen(PORT, handleListen);

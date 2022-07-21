import http from "http";
import express from "express";
import WebSocket from "ws";

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

const handleListen = () =>
  console.log(`✅✅✅Listening on http://localhost:${PORT} 🤖🤖🤖`);

const server = http.createServer(app);
//http server
const wss = new WebSocket.Server({ server });
//websoket server

const sockets = [];

function onSocketClose() {
  console.log("Disconnected from Browser❌");
}

wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("connected to Browser✅");
  socket.on("close", onSocketClose);
  socket.on("message", (message) => {
    const translatedMessageData = message.toString("utf8");
    sockets.forEach((aSocket) => aSocket.send(translatedMessageData));
  });
});
//백엔드의 소켓은 연결된 브라우저를 뜻한다

server.listen(PORT, handleListen);

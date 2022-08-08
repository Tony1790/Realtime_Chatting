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

const handleListen = () =>
  console.log(`✅✅✅Listening on http://localhost:${PORT} 🤖🤖🤖`);

httpServer.listen(PORT, handleListen);

const socket = io();
const welcome = document.getElementById("welcome");
const roomNameform = document.getElementById("roomName");
const roomNicknameForm = document.getElementById("name");
const room = document.getElementById("room");

room.hidden = true;

let roomName;
let NicknameInputValue;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You : ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  //const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  //nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleSubmit(event) {
  event.preventDefault();
  const roomNameInput = roomNameform.querySelector("input");
  roomName = roomNameInput.value;
  const NicknameInput = roomNicknameForm.querySelector("input");
  NicknameInputValue = NicknameInput.value;
  socket.emit("enter_room", roomNameInput.value, NicknameInputValue, showRoom);
}

roomNameform.addEventListener("submit", handleSubmit);
roomNicknameForm.addEventListener("submit", handleSubmit);

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} joined!`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} is left! ㅠㅠ`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

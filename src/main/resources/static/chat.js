const ws = new WebSocket("wss://af35149bbef9.ngrok-free.app/chat");

const chatLog = document.getElementById("chatLog");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// ws.onopen = () => {
//     appendLog("서버 연결 성공");
// };

ws.onmessage = (event) => {
    appendLog(event.data);
};

ws.onclose = () => {
    appendLog("서버 연결 끊김");
};

ws.onerror = (error) => {
    appendLog("에러: " + error.message);
};

sendBtn.onclick = sendMessage;
messageInput.onkeyup = (event) => {
    if(event.key === "Enter") {
        sendMessage();
    }
};

function sendMessage() {
    const msg = messageInput.value.trim();
    if(msg === "") return;
    ws.send(msg);
    messageInput.value = "";
}

function appendLog(message) {
    const div = document.createElement("div");
    div.textContent = message;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
}

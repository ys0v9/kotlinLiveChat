const nicknameSection = document.getElementById("nicknameSection");
const nicknameInput = document.getElementById("nicknameInput");
const nicknameBtn = document.getElementById("nicknameBtn");
const chatLog = document.getElementById("chatLog");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let ws = null;

function setNickname() {
    const nickname = nicknameInput.value.trim();
    if (nickname === "") {
        alert("닉네임을 입력해주세요.");
        return;
    }

    ws = new WebSocket("wss://f90301db302e.ngrok-free.app/chat");

    ws.onopen = () => {
        ws.send(nickname);
        nicknameSection.style.display = "none";
        chatLog.style.display = "block";
        document.querySelector(".chat-input").style.display = "flex";
        appendLog("서버에 연결되었습니다.");
    };

    ws.onmessage = (event) => {
        appendLog(event.data);
    };

    ws.onclose = () => {
        appendLog("서버 연결 끊김");
    };

    ws.onerror = (error) => {
        appendLog("에러: " + error.message);
    };
}

nicknameInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        setNickname();
    }
});

nicknameBtn.onclick = setNickname;

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert("서버 연결 X");
        return;
    }
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
const logChat = (message) => {
    const parent = document.querySelector('#messages');
    const p = document.createElement('p');
    p.innerHTML = message;

    parent.appendChild(p);
    parent.scrollTop = parent.scrollHeight;
};

function onChat(e) {
    e.preventDefault();

    const input = document.getElementById('chatMessage');
    const message = input.value;
    input.value = '';

    logChat(message)
};

// Verbinding maken met server
const sock = io();

document.getElementById('chatForm').addEventListener('submit', onChat);
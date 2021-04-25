// Verbinding maken met server
const sock = io('http://localhost:3001');


window.addEventListener('load', () => {
    // Eventlistener voor het sturen van een chatbericht
    document.getElementById('chatForm').addEventListener('submit', onChat);

    // Eventlistener voor het inloggen
    document.getElementById('loginForm').addEventListener('submit', onLogin);

});


// Voegt een bericht toe aan de chatbox
function logChat(message) {
    const parent = document.querySelector('#messages');
    const p = document.createElement('p');
    p.innerHTML = message;

    parent.appendChild(p);
    parent.scrollTop = parent.scrollHeight;
}

// Voegt de lijst van spelers toe op het scherm
function logPlayers(playerSet) {
    playerSet = JSON.parse(playerSet);
    console.log(playerSet);
    const parent = document.querySelector('#players div');
    parent.innerHTML = '';

    playerSet.forEach(player => {
        const p = document.createElement('p');
        p.innerHTML = player.username + ' (' + player.playerState + ')';
        parent.appendChild(p);
    });


    parent.scrollTop = parent.scrollHeight;
}

// Eventhandler voor het sturen van een chatbericht
function onChat(e) {
    e.preventDefault();

    const input = document.getElementById('chatMessage');
    let message = input.value;

    if (message !== '') {
        input.value = '';
        // Stuurt het bericht naar de io server
        sock.emit('chatMessage', message);
    }
}

// Eventhandler voor het inloggen 
function onLogin(e) {
    e.preventDefault();

    const button = document.getElementById("loginButton");
    const input = document.getElementById('nameBox');
    const sendChat = document.getElementById('sendChatMessage');
    const username = input.value;

    // input.value = '';
    if (username !== '') {
        input.style.display = 'none';
        button.style.display = 'none';
        sendChat.disabled = false;
        
        // Stuurt de username naar de io server
        sock.emit('login', username);
    }
}

// Bij het ontvangen van een chatbericht door de server of andere client
// wordt het bericht in de chatbox weergegeven
sock.on('chatMessage', logChat);

// Bij het ontvangen een spelerlijst van de server wordt die weergegeven rechts op het scherm
sock.on('playerList', logPlayers);

// Bij het ontvangen van een muisbeweging wordt deze getoond op het scherm (TESTING)
sock.on('mouse move', ({x, y}) => {
    const canvas = document.getElementById('screen');
    const context = canvas.getContext('2d');
    context.fillRect(x, y, 10, 10);
})
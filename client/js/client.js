// Verbinding maken met server
const sock = io('http://localhost:3001');

// Eventlistener voor het sturen van een chatbericht
window.addEventListener('load', () => {
    document.getElementById('chatForm').addEventListener('submit', onChat);
});

// voegt een bericht toe aan de chatbox
function logChat(message) {
    const parent = document.querySelector('#messages');
    const p = document.createElement('p');
    p.innerHTML = message;

    parent.appendChild(p);
    parent.scrollTop = parent.scrollHeight;
};
// eventhandler functie voor het sturen van een chatbericht
function onChat(e) {
    e.preventDefault();

    const input = document.getElementById('chatMessage');
    const message = input.value;
    input.value = '';

    // Stuurt het bericht naar de io server
    sock.emit('chatMessage', message);
};
// Vraagt de gebruikersnaam van de speler
function getUsername() {
    return window.prompt('Enter username');
};

// Bij het ontvangen van een chatbericht door de server of andere client
// wordt het bericht in de chatbox weergegeven
sock.on('chatMessage', logChat);

// Stuurt je gebruikersnaam naar de server
sock.emit('user joined', getUsername());

sock.on('mouse move', ({ x, y }) => {
    const canvas = document.getElementById('screen');
    const context = canvas.getContext('2d');
    context.fillRect(x, y, 10, 10);
})
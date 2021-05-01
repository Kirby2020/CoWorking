// Verbindt ofwel met de live server of de local server
import { sock } from './game/game.js';
// const sock = io.connect('https://game.jonathanvercammen.ikdoeict.be');

let memory = {};



window.addEventListener('load', () => {
    // Eventlistener voor het sturen van een chatbericht
    document.getElementById('chatForm').addEventListener('submit', onChat);

    // Eventlistener voor het inloggen
    document.getElementById('loginForm').addEventListener('submit', onLogin);

    // Eventlisteners voor het verbergen en weergeven van de zijpanelen
    document.getElementById("left").addEventListener('click', hideLeft);
    document.getElementById("right").addEventListener('click', hideRight);

});

// Toggled de zijpanelen
function hideLeft() {
    document.getElementById('chat').classList.toggle('hide');
}
function hideRight() {
    document.getElementById('playerList').classList.toggle('hide');
}

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
        let markup = `
        <div>
            <p>${player.username} (${player.playerState})</p>
            <button class="inviteButton" data-username="${player.username}">+</button>
        </div>
    `;
    // https://css-tricks.com/get-references-from-html-built-with-template-literals/
    const getNodes = str => { 
        return new DOMParser().parseFromString(str, 'text/html').body.childNodes;
    }

    parent.appendChild(getNodes(markup)[0]);
    });
    parent.scrollTop = parent.scrollHeight;

    inviteListener();
}

function inviteListener() {
    const inviteButtons = document.querySelectorAll('.inviteButton');

    inviteButtons.forEach(inviteButton => {
        console.log(inviteButton)
        inviteButton.addEventListener('click', (e) => {
            const fromUsername = memory.username;
            const toUsername = e.target.dataset.username;
        
            console.log('you: ', fromUsername);
            console.log('other', toUsername);
            if (fromUsername !== toUsername) {
                sock.emit('invite', {from: fromUsername, to: toUsername})
            }
        });
    })
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
        // input.style.display = 'none';
        // button.style.display = 'none';
        input.style.visibility = 'hidden';
        button.style.visibility = 'hidden';
        sendChat.disabled = false;

        memory.username = username;
        // Stuurt de username naar de io server
        sock.emit('login', username);
    }
}

// Bepaalt wat er gebeurt bij een invite status
// pending, rejected, accepted
function handleInviteStatus(status) {
    console.log('invite status', status)
}

function handleInvite(invite) {
    console.log('invite from', invite)
}

// Bij het ontvangen van een chatbericht door de server of andere client
// wordt het bericht in de chatbox weergegeven
sock.on('chatMessage', logChat);

// Bij het ontvangen een spelerlijst van de server wordt die weergegeven rechts op het scherm
sock.on('playerList', logPlayers);

// Bij het ontvangen van jouw invite status, wordt die bekeken door de invite status handler
sock.on('statusInvite', handleInviteStatus);

// Bij het ontvangen van een invite wordt die weergeven op jouw scherm (rechtsonderaan)
// Als je reageert wordt de response doorgestuurd met sock.emit('responseInvite', response)
sock.on('invite', handleInvite)
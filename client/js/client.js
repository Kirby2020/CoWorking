// Verbindt ofwel met de live server of de local server
import { sock } from './game/game.js';
// const sock = io.connect('https://game.jonathanvercammen.ikdoeict.be');

let memory = {};
let players = {};



window.addEventListener('load', () => {
    // Zet de lijst van invites op onzichtbaar
    document.getElementById('inviteList').classList.add('hide');

    // Eventlistener voor het sturen van een chatbericht
    document.getElementById('chatForm').addEventListener('submit', onChat);

    // Eventlistener voor het inloggen
    document.getElementById('loginForm').addEventListener('submit', onLogin);

});

// Voegt een bericht toe aan de chatbox
function logChat(message) {
    const parent = document.querySelector('#messages section');
    const p = document.createElement('p');
    p.innerHTML = message;

    parent.appendChild(p);
    parent.scrollTop = parent.scrollHeight;
}

// Voegt de lijst van spelers toe op het scherm
function logPlayers(playerSet) {
    playerSet = JSON.parse(playerSet);
    console.log(playerSet);
    players = playerSet;
    const parent = document.querySelector('#players section');
    parent.innerHTML = '';

    playerSet.forEach(player => {
        let markup = `
        <div class="player">
            <p style="background-color:${player.color}" class="name">${player.username} (${player.role})</p>
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

    const input = document.getElementById('nameBox');
    const sendChat = document.getElementById('sendChatMessage');
    const username = input.value;

    if (username !== '' && players.indexOf(username) === -1) {
        input.style.display = 'none';
        sendChat.disabled = false;
        document.getElementById('inviteList').classList.toggle('hide');

        memory.username = username;
        // Stuurt de username naar de io server
        sock.emit('login', username);
    }
}

// Bepaalt wat er gebeurt bij een invite status
// pending, rejected, accepted
// Stap 2 & 4 in het invite system
function handleInviteStatus(status) {
    console.log('invite status', status)

    if (status === 'accepted') {
        console.log('Changing state');
        sock.emit('requestGameRoom', (memory.username));
    }
}

// Toont de invite op jouw scherm en geeft je de optie om te accepteren of te weigeren
// Stap 2 in het invite system
function handleInviteReceived(from) {
    console.log('invite from', from);

    const parent = document.querySelector('#invitesReceived');

    let markup = `
        <div>
            <p>${from} heeft je uitgenodigd om te spelen!</p>
            <div>
                <button class="inviteAcceptButton" data-username="${from}">Accepteren</button>
                <button class="inviteDeclineButton" data-username="${from}">Weigeren</button>
            </div>
        </div>
    `;
    // https://css-tricks.com/get-references-from-html-built-with-template-literals/
    const getNodes = str => { 
        return new DOMParser().parseFromString(str, 'text/html').body.childNodes;
    }

    parent.appendChild(getNodes(markup)[0]);
    parent.scrollTop = parent.scrollHeight;

    inviteResponseListener();
}

// Voegt een eventlistener aan elke invite knop in de playerlijst
// On click wordt de invite naar de server gestuurd
// Stap 1 in invite system
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
    });
}

// Voegt een eventlistener aan alle invite accept en decline knoppen
// On click wordt de response naar de server gestuurd
// Stap 3 in het invite system
function inviteResponseListener() {
    const inviteAcceptButtons = document.querySelectorAll('.inviteAcceptButton');
    const inviteDeclineButtons = document.querySelectorAll('.inviteDeclineButton');

    inviteAcceptButtons.forEach(acceptButton => {
        acceptButton.addEventListener('click', (e) => {
            console.log('Accepted invite from', e.target.dataset.username);
            const to = memory.username;
            const from = e.target.dataset.username;
            const response = 'accepted';
            sock.emit('responseInvite', ({response: response, to, from}));  // accepted, invited person (YOU, to), inviter (from)
            e.target.parentNode.parentNode.remove();
        });
    });


    inviteDeclineButtons.forEach(declineButton => {
        declineButton.addEventListener('click', (e) => {
            console.log('Declined invite from', e.target.dataset.username);
            e.target.parentNode.parentNode.remove();
        });
    });
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
sock.on('invite', handleInviteReceived)
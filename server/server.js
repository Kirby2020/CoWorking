/*
http: server
express: local server
socketio: websocket

sock: socket of 1 verbinding
io: alle verbindingen
*/

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const Players = require('./players');
const GameState = require('./gameState');

const app = express();
const port = 3001;

// Static folder voor client bestanden te vinden
app.use(express.static(path.join(__dirname, '../client')));

// Maken van de server
const server = http.createServer(app);
const io = socketio(server);

let playerSet = [];
let gameState = new GameState();

// Wanneer iemand verbind met de server (naar de site gaat)
io.on('connection', (sock) => {
    // Alle events komen hier

    // let playerSet = new Players();


    sock.on('login', function logged(player){
        // Wanneer iemand is ingelogd wordt hij toegevoegd aan de spelerlijst
        // en stuurt de server een lijst met alle spelers terug naar de clients
        console.log('user connected');
        playerSet.push(player = {
            username: player,
            playerState: 'in lobby'
        });
        io.emit('playerList', playerSet);

        // Stuurt een bericht naar de huidige gebruiker
        sock.emit('chatMessage', `> Welkom ${player.username}.`);

        // Stuurt een bericht naar alle andere users
        sock.broadcast.emit('chatMessage', `> ${player.username} speelt mee!`);

        // Als de server een bericht ontvangt, stuurt hij die door naar de andere gebruikers
        sock.on('chatMessage', (message) => {
            io.emit('chatMessage', `${player.username}: ${message}`);
        });

        // Als iemand de server verlaat, wordt iedereen op de hoogte gebracht
        sock.on('logout', (leavingPlayer) => {
            io.emit('chatMessage', `> ${leavingPlayer.username} speelt niet meer mee.`);
            playerSet.splice(playerSet.indexOf(leavingPlayer), 1);
            io.emit('playerList', playerSet);
        });
    });


    sock.on('mouse move', ({ x, y }) => {
        io.emit('mouse move', { x, y });
    });

});




server.on('error', (error) => {
    console.error(error);
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
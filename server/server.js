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

//let playerSet = [];
const playerSet = new Players();
const gameState = new GameState();

// DEBUG
// const players = new Players();
// let i = 0;
// setInterval(() => {
//     players.add(`test${i}`, 'in lobby');
//     console.log(players.getAll())
//     i++;

//     console.log('ONE', players.getOne('test2'))
// }, 5000)


setInterval(() => {
    console.log('SET', playerSet);
}, 1000)


// Wanneer iemand verbind met de server (naar de site gaat)
io.on('connection', (sock) => {
    // Alle events komen hier

    // Stuurt de playerlijst ook naar de mensen die nog niet ingelogd zijn
    io.emit('playerList', JSON.stringify([...playerSet.players]));


    sock.on('login', (player) => {
        // Wanneer iemand is ingelogd wordt hij toegevoegd aan de spelerlijst
        // en stuurt de server een lijst met alle spelers terug naar de clients
        
        //console.log('user connected', player);
        playerSet.add(player, 'in lobby');
        sock.username = playerSet.getOne(player).username;

        // Stuurt de playerlijst naar alle users
        io.emit('playerList', JSON.stringify([...playerSet.players]));

        // Stuurt een bericht naar de huidige gebruiker
        sock.emit('chatMessage', `> Welkom ${player}.`);

        // Stuurt een bericht naar alle andere users
        sock.broadcast.emit('chatMessage', `> ${player} speelt mee!`);

        // Als de server een bericht ontvangt, stuurt hij die door naar de andere gebruikers
        sock.on('chatMessage', (message) => {
            io.emit('chatMessage', `${player}: ${message}`);
        });

        // Als iemand de server verlaat, wordt iedereen op de hoogte gebracht
        // en verwijderd uit de spelerlijst
        sock.on('disconnect', (reason) => {
            sock.broadcast.emit('chatMessage', `> ${sock.username} speelt niet meer mee.`);
            playerSet.remove(sock.username);
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
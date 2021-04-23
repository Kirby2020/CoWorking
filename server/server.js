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

const Players = require('players');

const app = express();
const port = 3001;

// Static folder voor client bestanden te vinden
app.use(express.static(path.join(__dirname, '../client')));

// Maken van de server
const server = http.createServer(app);
const io = socketio(server);

// Wanneer iemand verbind met de server (naar de site gaat)
io.on('connection', (sock) => {
    // Alle events komen hier

    const players = new Players();

    sock.on('login', (username) => {
        // Wanneer iemand is ingelogd wordt hij toegevoegd aan de spelerlijst
        // en stuurt de server een lijst met alle spelers terug naar de clients
        console.log('user connected');
        players.add(username);
        io.emit('playerList', players);

        // Stuurt een bericht naar de huidige gebruiker
        sock.emit('chatMessage', `Welcome ${username}`);

        // Stuurt een bericht naar alle andere users
        sock.broadcast.emit('chatMessage', `${username} has connected`);

        // Als de server een bericht ontvangt, stuurt hij die door naar de andere gebruikers
        sock.on('chatMessage', (message) => {
            io.emit('chatMessage', `${username}: ${message}`);
        });

        // Als iemand de server verlaat, wordt iedereen op de hoogte gebracht
        sock.on('disconnect', () => {
            io.emit('chatMessage', `${username} has disconnected`);
            players.remove(username);
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
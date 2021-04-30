/*
http: server
express: local server
socketio: websocket

sock: socket of 1 verbinding
io: alle verbindingen
*/
console.log('Server Starting...')

const path = require('path');
const http = require('https');
const express = require('express');
const socketio = require('socket.io');

const randomColor = require('randomcolor');

const Players = require('./players');
const GameState = require('./gameState');

const app = express();
const port = process.env.PORT || 3001;



// Basic express server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'))
});
// Static folder voor client bestanden te vinden
app.use(express.static(path.join(__dirname, '../client')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Maken van de io server
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})



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

    // Elke client krijgt een unieke kleur van cursor
    let color = randomColor() || 'black';

    // Bij het ontvangen van een muisbeweging van een client, stuurt de server die muispositie terug naar alle andere clients
    sock.on('mouse move', ({ x, y }) => {
        io.emit('mouse move', { x, y, color });
    });


    sock.on('login', (player) => {
        // Wanneer iemand is ingelogd wordt hij toegevoegd aan de spelerlijst
        // en stuurt de server een lijst met alle spelers terug naar de clients
        // Elke speler krijgt een andere kleur van cursor
        
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
            try {
                playerSet.remove(sock.username)
                .then(players => {
                    sock.broadcast.emit('playerList', JSON.stringify([...players]))
                })    
            }
            catch (error) {
                console.log(error);
            }
        });


    });


});




server.on('error', (error) => {
    console.error(error);
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})








/*
Package.json voor hosted server
{
  "name": "coworking",
  "version": "1.0.0",
  "scripts": {
	"start": "node server/server.js
  },
  "engines": {
	  "node": "14.16.x"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "pvz multiplayer game",
  "dependencies": {
    "express": "^4.17.1",
    "socket.io": "^4.0.1",
    "utf-8-validate": "^5.0.2"
  }
}
*/
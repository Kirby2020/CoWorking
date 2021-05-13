/*
http: server
express: local server
socketio: websocket

sock: socket of 1 verbinding
io: alle verbindingen
*/
console.log('Server Starting...')

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const randomColor = require('randomcolor');

const Players = require('./players');
const GameState = require('./gameState');
const Cursors = require('./cursors');
const GameField = require('./gameField');

const app = express();
const port = process.env.PORT || 3001;


// Basic express server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'))
});
// Static folder voor client bestanden te vinden
app.use(express.static(path.join(__dirname, '../client')));

app.use(function (req, res, next) {
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
const cursors = new Cursors();
const gameField = new GameField();
let gameRoomNumber = 1;
let playersInRoom = 0;


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
    console.log('CURSORS', cursors);
    console.log('GAMEFIELD', gameField);
    console.log('--------------------------------')
}, 1000)


// Wanneer iemand verbind met de server (naar de site gaat)
io.on('connection', (sock) => {
    // Alle events komen hier
    gameField.reset();
    // Stuurt de playerlijst ook naar de mensen die nog niet ingelogd zijn
    io.emit('playerList', JSON.stringify([...playerSet.players]));
    // En toont het huidige spel (spectating)
    // Later gaat dit weg als we kunnen werken met rooms en meerdere games tegelijk kunnen runnen
    io.emit('gameField', JSON.stringify(gameField));


    sock.on('login', (player) => {
        // Wanneer iemand is ingelogd wordt hij toegevoegd aan de spelerlijst
        // en stuurt de server een lijst met alle spelers terug naar de clients
        // Elke speler krijgt een andere kleur van cursor

        // Elke client krijgt een unieke kleur van cursor
        let color = randomColor() || 'black';
        cursors.add(null, null, color);

        //console.log('user connected', player);
        playerSet.add(player, 'in lobby', sock.id, "spectating", color);
        sock.username = playerSet.getOne(player).username;

        // Stuurt de playerlijst naar alle users
        io.emit('playerList', JSON.stringify([...playerSet.players]));

        // Stuurt een bericht naar de huidige gebruiker
        sock.emit('chatMessage', `> Welkom <span style="background-color:${color}" class="name">${player}</span>.`);

        // Stuurt een bericht naar alle andere users
        sock.broadcast.emit('chatMessage', `> <span style="background-color:${color}" class="name">${player}</span> speelt mee!`);

        // Als de server een bericht ontvangt, stuurt hij die door naar de andere gebruikers
        sock.on('chatMessage', (message) => {
            io.emit('chatMessage', `<span style="background-color:${color}" class="name">${player}</span>: ${message}`);
        });


        // Bij het ontvangen van een muisbeweging van een client, stuurt de server die muispositie terug naar alle andere clients
        sock.on('mouse move', ({x, y}) => {
            cursors.update(color, x, y);
            io.emit('mouse move', JSON.stringify([...cursors.cursors]));
        });
        sock.on('selectedCell', cell => {
            sock.broadcast.emit('selectedCell', cell);
        });
        sock.on('selectedSeedSlot', selectedSeedSlot => {
            io.emit('selectedSeedSlot', selectedSeedSlot);
        });


        // sock.on('gameField', gameField => {
        //     console.log(gameField);
        //     io.emit('gameField', gameField);
        // });

        // sock.on('gameFieldAddLawnmower', lawnmowerInfo => {
        //     gameField.addLawnmower(lawnmowerInfo.x, lawnmowerInfo.y);
        //     io.emit('gameField', JSON.stringify(gameField));
        // });
        sock.on('gameFieldRemoveLawnmower', index => {
            gameField.removeLawnmower(index);
            io.emit('gameField', JSON.stringify(gameField));
        });
        // sock.on('gameFieldAddTarget', targetInfo => {
        //     gameField.addTarget(targetInfo.x, targetInfo.y);
        //     io.emit('gameField', JSON.stringify(gameField));
        // });
        sock.on('gameFieldRemoveTarget', index => {
            gameField.removeTarget(index);
            io.emit('gameField', JSON.stringify(gameField));
        });

        // plantInfo = {name, x, y}
        sock.on('gameFieldAddPlant', plantInfo => {
            gameField.addPlant(plantInfo.name, plantInfo.x, plantInfo.y);
            io.emit('gameField', JSON.stringify(gameField));
        });

        sock.on('gameFieldRemovePlant', index => {
            gameField.removePlant(index);
            io.emit('gameField', JSON.stringify(gameField));
        });

        // zombieInfo = {name, x, y}
        sock.on('gameFieldAddZombie', zombieInfo => {
            gameField.addZombie(zombieInfo.name, zombieInfo.x, zombieInfo.y);
            io.emit('gameField', JSON.stringify(gameField));
        });
        sock.on('gameFieldRemoveZombie', index => {
            gameField.removeZombie(index);
            io.emit('gameField', JSON.stringify(gameField));
        });

        // Als iemand een invite stuurt, krijgt de zender de status terug (voorlopig pending)
        // De ontvanger krijgt de invite met naam
        sock.on('invite', ({from, to}) => {
            console.log('from', from, 'to', to);
            io.to(getId(to)).emit('invite', (from))
            sock.emit('statusInvite', "pending");

        });

        // Als de persoon reageert op jouw invite stuurt hij die response terug naar jou
        // Beide spelers hun status verandere naar selecting
        // Later worden ze in een aparte gameroom gestoken
        sock.on('responseInvite', ({response, to, from}) => {
            console.log(to + ' ' + response + ' ' + from);

            io.to(getId(from)).emit('statusInvite', (response));
            io.to(getId(to)).emit('statusInvite', (response));

            if (response === 'accepted') {
                console.log('Setting playerStates...')
                playerSet.setState(from, 'selecting');
                playerSet.setState(to, 'selecting');

                playerSet.setRole(from, "Plants");
                playerSet.setRole(to, "Zombies");

                io.to(getId(from)).emit('role', ("Plants"));
                io.to(getId(to)).emit('role', ("Zombies"));

                io.emit('playerList', JSON.stringify([...playerSet.players]));

                // reset gameField bij een invite (nieuwe game)
                gameField.reset();
                io.emit('gameField', gameField);

            }
        })

        sock.on('requestGameRoom', (player) => {
            console.log('Joining room: ', gameRoomNumber, 'player', player)
            playersInRoom++;

            if (playersInRoom >= 2) {
                gameRoomNumber++;
                playersInRoom = 0;
            } else {
                sock.join('gameRoom' + gameRoomNumber);
                gameState.set('selecting');
                console.log(gameState.get());
            }
        })


        // Als iemand de server verlaat, wordt iedereen op de hoogte gebracht
        // en verwijderd uit de spelerlijst
        sock.on('disconnect', (reason) => {
            sock.broadcast.emit('chatMessage', `> <span style="background-color:${color}" class="name">${sock.username}</span> speelt niet meer mee.`);
            try {
                playerSet.remove(sock.username)
                    .then(players => {
                        sock.broadcast.emit('playerList', JSON.stringify([...players]))
                    })
                cursors.remove(color)
            } catch (error) {
                console.log(error);
            }

            if (playerSet.getAll().size < 1) {
                gameField.reset();
                io.emit('gameField', gameField);
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


function getId(username) {
    return playerSet.getOne(username).id;
}

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



{
  "name": "coworking",
  "version": "1.0.0",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^4.17.1",
    "randomcolor": "^0.6.2",
    "socket.io": "^4.0.1",
    "socket.io-client": "^4.0.1"
  }
}

*/
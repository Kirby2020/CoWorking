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
let timer = 0;
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
    if (gameState.get() === 'in game') {
        timer++;
        console.log(timer);
        io.emit('time', timer);
        if (timer % 60 === 0) {
            const resources = gameField.passiveResources();
            io.emit('gameFieldPassiveResources', JSON.stringify(resources));
        }
        if (timer === 600) {
            io.emit('chatMessage', `> <span style="color:red">SUDDEN DEATH!</span>`)
        }
    }
    console.log('--------------------------------')
}, 1000);


// Wanneer iemand verbind met de server (naar de site gaat)
io.on('connection', (sock) => {
    // Alle events komen hier
    // Toont huidige game
    io.emit('gameFieldReset', JSON.stringify(gameField));

    // Stuurt de playerlijst ook naar de mensen die nog niet ingelogd zijn
    io.emit('playerList', JSON.stringify([...playerSet.players]));



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

        sock.on('gameFieldAddSun', plantInfo => {
            const sun = gameField.addSun(plantInfo.index, plantInfo.sun);
            io.emit('gameFieldSetSun', JSON.stringify(sun));
        });
        sock.on('gameFieldAddBrains', zombieInfo => {
            const brains = gameField.addBrains(zombieInfo.index, zombieInfo.brains);
            io.emit('gameFieldSetBrains', JSON.stringify(brains));
        });

        // plantInfo = {name, x, y}
        sock.on('gameFieldAddPlant', plantInfo => {
            const plant = gameField.addPlant(plantInfo.name, plantInfo.x, plantInfo.y);
            io.emit('gameFieldAddPlant', JSON.stringify(plant));
        });
        // zombieInfo = {name, x, y}
        sock.on('gameFieldAddZombie', zombieInfo => {
            const zombie = gameField.addZombie(zombieInfo.name, zombieInfo.x, zombieInfo.y);
            io.emit('gameFieldAddZombie', JSON.stringify(zombie));
        });

        sock.on('gameFieldRemovePlant', index => {
            gameField.removePlant(index);
            // io.emit('gameFieldRemovePlant', (index));
        });
        sock.on('gameFieldRemoveZombie', index => {
            gameField.removeZombie(index);
            // io.emit('gameFieldRemoveZombie', (index));
        });

        sock.on('gameFieldRemoveLawnmower', index => {
            gameField.removeLawnmower(index);
            // io.emit('gameFieldRemoveLawnmower', (index));
        });
        sock.on('gameFieldRemoveTarget', index => {
            gameField.removeTarget(index);
            // io.emit('gameFieldRemoveTarget', (index));
        });

        // als een winnaar bepaald is stuur het naar alle spelers
        sock.on('win', (winner) => {
            io.emit('chatMessage', `> ${winner} winnen!`);
            io.emit('win', winner);
            gameField.setWinner(winner);
            gameState.set('results');
            for (const player of playerSet.players) {
                playerSet.setRole(player.username, 'spectating');
                playerSet.setState(player.username, 'in lobby');
            }
            io.emit('playerList', JSON.stringify([...playerSet.players]));
            gameField.reset();
            timer = 0;
            io.emit('gameFieldReset', JSON.stringify(gameField));
        });


        // Als iemand een invite stuurt, krijgt de zender de status terug (voorlopig pending)
        // De ontvanger krijgt de invite met naam
        sock.on('invite', ({from, to}) => {
            console.log('from', from, 'to', to);
            io.to(getId(to)).emit('invite', (from))
            sock.emit('statusInvite', "pending");
        });

        // Als de persoon reageert op jouw invite stuurt hij die response terug naar jou
        // Beide spelers hun status veranderd naar selecting
        // Later worden ze in een aparte gameroom gestoken
        sock.on('responseInvite', ({response, to, from}) => {
            console.log(to + ' ' + response + ' ' + from);

            io.to(getId(from)).emit('statusInvite', (response));
            io.to(getId(to)).emit('statusInvite', (response));

            if (response === 'accepted') {
                // reset gameField bij een invite (nieuwe game)
                gameField.reset();
                io.emit('gameFieldReset', JSON.stringify(gameField));

                console.log('Setting playerStates...')
                playerSet.setState(from, 'in game');
                playerSet.setState(to, 'in game');

                playerSet.setRole(from, "Plants");
                playerSet.setRole(to, "Zombies");

                io.to(getId(from)).emit('role', ("Plants"));
                io.to(getId(to)).emit('role', ("Zombies"));

                timer = 0;

                io.emit('playerList', JSON.stringify([...playerSet.players]));
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
                // gameState.set('selecting');
                gameState.set('in game'); // aangezien we geen select screen hebben
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
            // reset gameField als er geen personen meer zijn
            if (playerSet.getAll().size < 1) {
                gameField.reset();
                timerOn = false;
                timer = 0;
                io.emit('gameFieldReset', JSON.stringify(gameField));
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
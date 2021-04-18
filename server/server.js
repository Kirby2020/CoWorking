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

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, '../client')));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (sock) => {
    console.log('A user connected');
})

server.on('error', (error) => {
    console.error(error);
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
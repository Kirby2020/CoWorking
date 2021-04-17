const path = require('path');
const http = require('http');
const express = require('express');

const app = express();

const port = 3001;

app.use(express.static(path.join(__dirname, '../')));

const server = http.createServer(app);


server.on('error', (error) => {
    console.error(error);
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
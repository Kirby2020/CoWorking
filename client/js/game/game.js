import { drawBackground, drawCursor, drawSeedBanks } from './drawLayers.js';
import { canvas, context, CELL_SIZE, gameGrid } from './constants.js';
import { drawGameGrid } from './gameGrid.js';

// Verbindt ofwel met de live server of de local server
// const sock = io('http://localhost:3001');
const sock = io.connect('https://game.jonathanvercammen.ikdoeict.be');

// Zoekt de muispositie op
function getMouseCoordinates(element, event) {
    // coördinaten van het element
    const { top, left } = element.getBoundingClientRect();
    // coördinaten van de muis t.o.v. het volledige browser window
    const { clientX, clientY } = event;
    // console.log(event)
    // console.log(clientX, clientY)
    return {
        x: clientX - left,
        y: clientY - top
    };
}

const timer = 4;
let startTime = performance.now();
// Eventlistener voor de muiscoördinaten door te sturen naar de server
canvas.addEventListener('mousemove', (e) => {

    let currentTime = performance.now();

    if (currentTime - startTime > timer) {
        const { x, y } = getMouseCoordinates(canvas, e);
        sock.emit('mouse move', { x, y });
        startTime = currentTime;
    }



});

// Bij het ontvangen van een muisbeweging wordt deze getoond op het scherm (TESTING)
sock.on('mouse move', ({x, y, color}) => {
    drawCursor(x, y, color);
});

console.log(gameGrid)

function isIn(pos, cell) {
    if (pos.x < cell.x && pos.x > cell.x + CELL_SIZE.width) {
        if (pos.y < cell.y && pos.y > cell.y + CELL_SIZE.height) {
            return true;
        }
    }
}

// drawSelectedCells(cell) {

// }

function update() {
    drawBackground();
    drawSeedBanks();
    drawGameGrid();

    //drawSelectedCells();
    requestAnimationFrame(update);
}

update();


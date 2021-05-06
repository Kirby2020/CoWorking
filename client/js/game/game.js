import { drawBackground, drawCursors, drawSelectedCells } from './drawLayers.js';
import { canvas, context, CELL_SIZE, gameGrid, seedBankGridPlants, seedBankGridZombies, CELL_GAP } from './constants.js';
import { drawGameGrid } from './gameGrid.js';
import { drawSeedBanks } from './seedBanks.js';
import { Cell } from './classes/Cell.js';
import { isIn } from './utils.js';

// Verbindt ofwel met de live server of de local server
export const sock = io('https://pvz-game.herokuapp.com/');
// https://pvz-game.herokuapp.com/
// http://localhost:3001


console.log('gameGrid', gameGrid);
console.log('seedBankGridPlants', seedBankGridPlants);
console.log('seedBankGridZombies', seedBankGridZombies);


// ---------- MUIS ----------

const timer = 5;
let currentMousePositions = [];
let startTime = performance.now();

// Zoekt de muispositie op
function getMouseCoordinates(element, event) {
    // coördinaten van het element
    // const { top, left } = element.getBoundingClientRect();

    // coördinaten van de muis t.o.v. het volledige browser window
    // const { clientX, clientY } = event;

    // console.log(event)
    // console.log(clientX, clientY)
    // return {
    //     x: clientX - left,
    //     y: clientY - top
    // };

    let rect = element.getBoundingClientRect(), // abs. size of element
        scaleX = element.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = element.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        x: (event.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (event.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

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
sock.on('mouse move', (cursors) => {
    currentMousePositions = JSON.parse(cursors);
});






function update() {
    drawBackground();
    drawSeedBanks();
    drawGameGrid();
    drawSelectedCells(currentMousePositions);
    drawCursors(currentMousePositions);
    requestAnimationFrame(update);
}

update();


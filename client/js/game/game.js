import { drawBackground, drawCursors } from './drawLayers.js';
import { canvas, context, CELL_SIZE, gameGrid, seedBankGridPlants, seedBankGridZombies, CELL_GAP } from './constants.js';
import { drawGameGrid } from './gameGrid.js';
import { drawSeedBanks } from './seedBanks.js';
import { Cell } from './classes/Cell.js';

// Verbindt ofwel met de live server of de local server
export const sock = io('http://localhost:3001');
// https://pvz-game.herokuapp.com/
// http://localhost:3001


// ---------- MUIS ----------

const timer = 5;
let currentMousePositions = [];
let currentMousePos = {};
let startTime = performance.now();

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

// Kijkt of er collision is tussen een positie en een cell
function isIn(pos, cell) {
    if (pos.x > cell.x - CELL_GAP && pos.x < cell.x - CELL_GAP + cell.width) {
        if (pos.y > cell.y - CELL_GAP && pos.y < cell.y - CELL_GAP + cell.height) {
            return true;
        }
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
    console.log(cursors.cursors)
    currentMousePositions.push(...[cursors])
});

// ---------- Geselecteerde cellen ----------

// Tekent alle geselecteerde cells
function drawSelectedCells() {
    gameGrid.forEach(cell => {
        if (cell && isIn(currentMousePos, cell)) {
            cell.drawSelected();
            // sock.emit('selectedCell', cell);
        }
    })
    seedBankGridPlants.forEach(cell => {
        if (cell && isIn(currentMousePos, cell)) {
            cell.drawSelected();
            // sock.emit('selectedCell', cell);
        }
    })
    seedBankGridZombies.forEach(cell => {
        if (cell && isIn(currentMousePos, cell)) {
            cell.drawSelected();
            // sock.emit('selectedCell', cell);
        }
    })
}

// sock.on('selectedCell', cell => {
//     cell = new Cell(cell.x, cell.y)
//     cell.drawSelected();
// })


console.log('gameGrid', gameGrid);
console.log('seedBankGridPlants', seedBankGridPlants);
console.log('seedBankGridZombies', seedBankGridZombies);



function update() {
    drawBackground();
    drawSeedBanks();
    drawGameGrid();
    drawSelectedCells();
    //drawCursor(currentMousePos.x, currentMousePos.y, currentMousePos.color);
    drawCursors(currentMousePositions);
    requestAnimationFrame(update);
}

update();


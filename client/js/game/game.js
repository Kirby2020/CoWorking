import { drawBackground, drawCursors, drawSelectedCells } from './drawLayers.js';
import { canvas, context, CELL_SIZE, gameGrid, seedBankGridPlants, seedBankGridZombies, CELL_GAP, SEEDSLOT_SIZE } from './constants.js';
import { drawGameGrid } from './gameGrid.js';
import { drawSeedBanks } from './seedBanks.js';
import { Cell } from './classes/Cell.js';
import { isIn } from './utils.js';
import * as Plant from './classes/plants.js';
import * as Zombie from './classes/zombie.js'; 

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


// ---------- GAME ----------

let currentRole = "Spectator"; // plant of zombie, default : spectator
let resourcesPlants = 200; // Je begint steeds met 75 sun 
let resourcesZombies = 200; // Je begint steeds met 75 brains 
const plants = [];  // Slaat alle gegevens op van de planten op het scherm
const zombies = []; // Slaat alle gegevens op van de zombies op het scherm

// Wanneer er geklikt wordt op het game venster worden er een aantal dingen gedaan
// Controleren of je planten speelt of zombies
// Berekenen van de cel waarin geklikt wordt
// Controleren of je in het spelveld klikt
// Controleren of er al niks staat
// Controleren of je genoeg resources hebt
// Versuurd bij elke nieuwe plant of zombie die op het scherm wordt gezet, de volledige arrays van plants/zombies naar de server
canvas.addEventListener('click', (e) => {
    const { x, y } = getMouseCoordinates(canvas, e);
    const gridPositionX = x - (x % CELL_SIZE.width);
    const gridPositionY = y - (y % CELL_SIZE.height);

    if (currentRole === "Plants") {
        // ---------- SEEDBANKS ----------


        // ---------- SPELVELD ----------
        if (gridPositionY < SEEDSLOT_SIZE.height || gridPositionY > 5 * SEEDSLOT_SIZE.height) {
            return;
        }
        if (gridPositionX < 3 * CELL_SIZE.width || gridPositionX > 8 * CELL_SIZE.width) {
            console.log('for zombies')
            return;
        }
        for (let i = 0; i < plants.length; i++) {
            if (plants[i].x === gridPositionX && plants[i].y === gridPositionY) {
                return;
            }
        }
        let tempCost = 50;

        if (resourcesPlants >= tempCost) {
            plants.push(new Plant.Sunflower(gridPositionX, gridPositionY));
            resourcesPlants -= tempCost;
            sock.emit('gameField', (JSON.stringify({plants: plants, zombies: zombies,
                         resourcesPlants: resourcesPlants, resourcesZombies: resourcesZombies})));
        }
    } else if (currentRole === "Zombies") {
        // ---------- SEEDBANKS ----------
    
    
    
        // ---------- SPELVELD ----------
        if (gridPositionY < SEEDSLOT_SIZE.height || gridPositionY > 5 * SEEDSLOT_SIZE.height) {
            return;
        }
        if (gridPositionX < 9 * CELL_SIZE.width || gridPositionX > 11 * CELL_SIZE.width) {
            console.log('for plants')
            return;
        }
        for (let i = 0; i < zombies.length; i++) {
            if (zombies[i].x === gridPositionX && zombies[i].y === gridPositionY) {
                return;
            }
        }
        let tempCost = 50;
    
        if (resourcesZombies >= tempCost) {
            zombies.push(new Zombie.Grave(gridPositionX, gridPositionY));
            resourcesZombies -= tempCost;
            sock.emit('gameField', (JSON.stringify({plants: plants, zombies: zombies,
                         resourcesPlants: resourcesPlants, resourcesZombies: resourcesZombies})));
        }
    }
    else {
        console.log('You are currently spectating');
    }
});


function drawPlants() {
    for (let i = 0; i < plants.length; i++) {
        plants[i].draw();
    }
}

function drawZombies() {
    for (let i = 0; i < zombies.length; i++) {
        console.log(zombies[i])
        zombies[i].draw();
    }
}

function drawResources() {
    context.fillStyle = 'gold'
    context.font = '25px Arial';
    context.fillText(resourcesPlants, SEEDSLOT_SIZE.width / 2, SEEDSLOT_SIZE.height);
    context.fillText(resourcesZombies, canvas.width - SEEDSLOT_SIZE.width / 2, SEEDSLOT_SIZE.height);
}


sock.on('role', role => {
    currentRole = role;
    console.warn('changed role: ', currentRole);
});

sock.on('gameField', gameField => {
    gameField = JSON.parse(gameField);
    console.log(gameField.plants);
    console.log(gameField.zombies);

    plants = gameField.plants;
    zombies = gameField.zombies;
    resourcesPlants = gameField.resourcesPlants;
    resourcesZombies = gameField.resourcesZombies;
});


function update() {
    drawBackground();
    drawSeedBanks();
    // drawGameGrid();
    drawSelectedCells(currentMousePositions);
    drawPlants();
    drawZombies();
    drawResources();
    drawCursors(currentMousePositions);
    requestAnimationFrame(update);
}

update();


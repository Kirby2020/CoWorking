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

let currentRole = "Zombies"; // plant of zombie, default : spectator
let resourcesPlants = 200; // Je begint steeds met 75 sun 
let resourcesZombies = 200; // Je begint steeds met 75 brains 
let plants = [];  // Slaat alle gegevens op van de planten op het scherm
let zombies = []; // Slaat alle gegevens op van de zombies op het scherm
let currentFrame = 0;

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

    console.log('gridX', gridPositionX)
    console.log('gridY', gridPositionY)
    console.log('x', x, 'y', y)

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
            // plants.push(new Plant.Sunflower(gridPositionX, gridPositionY));
            // sock.emit('gameField', (JSON.stringify({plants: plants, zombies: zombies,
            //              resourcesPlants: resourcesPlants, resourcesZombies: resourcesZombies})));

            //resourcesPlants -= tempCost;
            sock.emit('gameFieldAddPlant', ({name: "sunflower", x: gridPositionX, y: gridPositionY}))
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
            //zombies.push(new Zombie.Grave(gridPositionX, gridPositionY));
            //resourcesZombies -= tempCost;
            // sock.emit('gameField', (JSON.stringify({plants: plants, zombies: zombies,
            //              resourcesPlants: resourcesPlants, resourcesZombies: resourcesZombies})));

            sock.emit('gameFieldAddZombie', ({name: "grave", x: gridPositionX, y: gridPositionY}))

                // alternative maybe: verzendt naam, x en y naar de server
                // server voegt die toe aan de array en stuurt de array terug
                // client maakt object met naam (switch statement) en x, y
                // verwijderen???
                // verzendt index naar de server
                // server zoekt op de index en verwijderd die plaats en stuurt terug de array
                // index client == index server 
        }
    }
    else {
        console.log('You are currently spectating');
    }
});


function drawPlants() {
    for (let i = 0; i < plants.length; i++) {
        // console.log(plants[i])
        if (plants[i]) {
            plants[i].update();
            plants[i].draw();
        }
    }
}

function drawZombies() {
    for (let i = 0; i < zombies.length; i++) {
        // console.log(zombies[i])
        if (zombies[i]) {
            zombies[i].update();
            zombies[i].draw();
        }
    }
}

function drawResources() {
    context.fillStyle = 'gold'
    context.font = '25px Arial';
    context.fillText(resourcesPlants, SEEDSLOT_SIZE.width / 2 - 10, SEEDSLOT_SIZE.height);
    context.fillText(resourcesZombies, canvas.width - SEEDSLOT_SIZE.width, SEEDSLOT_SIZE.height);
}


sock.on('role', role => {
    currentRole = role;
    console.warn('changed role: ', currentRole);
});

sock.on('gameField', gameField => {
    gameField = JSON.parse(gameField);
    console.log(gameField.plants);
    console.log(gameField.zombies);

    for (let i = 0; i < gameField.plants.length; i++) {
        // console.log(plants[i])
        const plant = createPlant(gameField.plants[i].name, gameField.plants[i].x, gameField.plants[i].y);
        plants.push(plant);
    }

    for (let i = 0; i < gameField.zombies.length; i++) {
        // console.log(zombies[i])
        const zombie = createZombie(gameField.zombies[i].name, gameField.zombies[i].x, gameField.zombies[i].y);
        zombies.push(zombie);
    }
});

function createPlant(name, x, y) {
    switch (name) {
        case 'sunflower': return new Plant.Sunflower;
        case 'peashooter': return new Plant.Peashooter(x, y);
    }
}

function createZombie(name, x, y) {
    switch (name) {
        case 'grave': return new Zombie.Grave(x, y);
        case 'normalZombie': return new Zombie.NormalZombie(x, y);
    }
}


function update() {
    drawBackground();
    drawSeedBanks();
    // drawGameGrid();
    drawSelectedCells(currentMousePositions);
    drawPlants();
    drawZombies();
    drawResources();
    drawCursors(currentMousePositions);
    currentFrame++;
    requestAnimationFrame(update);
}

update();


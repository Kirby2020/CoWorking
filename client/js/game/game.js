import {drawBackground, drawCursors, drawSelectedCells} from './drawLayers.js';
import {
    canvas,
    context,
    CELL_SIZE,
    gameGrid,
    seedBankGridPlants,
    seedBankGridZombies,
    CELL_GAP,
    SEEDSLOT_SIZE
} from './constants.js';
import {drawGameGrid} from './gameGrid.js';
import {drawSeedBanks} from './seedBanks.js';
import {Cell} from './classes/Cell.js';
import {collision} from './utils.js';
import * as Plant from './classes/plants.js';
import * as Zombie from './classes/zombie.js';
import * as Goal from './classes/goals.js';
import { Projectile } from './classes/projectile.js';

// Verbindt ofwel met de live server of de local server
// export const sock = io('https://pvz-game.herokuapp.com/');
export const sock = io('http://localhost:3001');


console.log('gameGrid', gameGrid);
console.log('seedBankGridPlants', seedBankGridPlants);
console.log('seedBankGridZombies', seedBankGridZombies);


// ---------- MUIS ----------

const timer = 5;
let currentMousePositions = [];
let startTime = performance.now();

// Zoekt de muispositie op
function getMouseCoordinates(element, event) {
    let rect = element.getBoundingClientRect(), // grootte van element
        scaleX = element.width / rect.width,    // grootte van afbeelding / werkelijke grootte
        scaleY = element.height / rect.height;

    return {
        x: (event.clientX - rect.left) * scaleX,   // schaal toepassen op muispositie
        y: (event.clientY - rect.top) * scaleY
    }
}

// Eventlistener voor de muiscoördinaten door te sturen naar de server
canvas.addEventListener('mousemove', (e) => {
    let currentTime = performance.now();

    if (currentTime - startTime > timer) {
        const {x, y} = getMouseCoordinates(canvas, e);
        sock.emit('mouse move', {x, y});
        startTime = currentTime;
    }
});

// Bij het ontvangen van een muisbeweging wordt deze getoond op het scherm (TESTING)
sock.on('mouse move', (cursors) => {
    currentMousePositions = JSON.parse(cursors);
});


// ---------- GAME ----------

// Slaat alle data op van de server
let currentRole = "Spectator"; // plant of zombie, default : spectator
let resourcesPlants = 200; // Je begint steeds met 75 sun 
let resourcesZombies = 200; // Je begint steeds met 75 brains 
let plants = [];  // Slaat alle gegevens op van de planten op het scherm
let zombies = []; // Slaat alle gegevens op van de zombies op het scherm
let lawnmowers = []; // data voor grasmaaiers
let targets = []; // data voor targets
export let time = 0;
export let projectiles = [];
let winner;
// Client specifiek
let currentFrame = 0;
let selectedSeedSlots = {plant: 0, zombie: 0}

// Wanneer er geklikt wordt op het game venster worden er een aantal dingen gedaan
// Controleren of je planten speelt of zombies, default spectator
// Berekenen van de cel waarin geklikt wordt
// Controleren of je in het spelveld klikt
// Controleren of er al niks staat
// Controleren of je genoeg resources hebt
// Verstuurd bij elke nieuwe plant of zombie die op het scherm wordt gezet de naam en zijn coördinaten
canvas.addEventListener('click', (e) => {
    const {x, y} = getMouseCoordinates(canvas, e);
    const gridPositionX = x - (x % CELL_SIZE.width);
    const gridPositionY = y - (y % CELL_SIZE.height);

    console.log('gridX', gridPositionX)
    console.log('gridY', gridPositionY)


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
        // Als er al een plant op die plaats staat
        for (let i = 0; i < plants.length; i++) {
            if (plants[i].x === gridPositionX && plants[i].y === gridPositionY + 10) {
                if (plants[i].hasSun === true) {
                    sock.emit('gameFieldAddSun', ({index: i, sun: plants[i].sun}));
                }
                return;
            }
        }

        if (time >= 600 && getSelectedPlant() === 'sunflower') {
            return;
        }

        if (resourcesPlants >= getSelectedPlantCost()) {
            // console.warn(getSelectedPlantCost())
            sock.emit('gameFieldAddPlant', ({name: getSelectedPlant(), x: gridPositionX, y: gridPositionY}));
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

        console.error(gridPositionX, gridPositionY)
        // Als er al een zombie op die plaats staat
        for (let i = 0; i < zombies.length; i++) {

            if (zombies[i].x === gridPositionX && zombies[i].y === gridPositionY + 6) {

                if (zombies[i].hasBrains === true) {
                    sock.emit('gameFieldAddBrains', ({index: i, brains: zombies[i].brains}));
                    zombies[i].hasBrains = false;
                    return;
                }
                if (getSelectedZombie() === 'grave' && zombies[i] instanceof Zombie.Grave) {
                    console.warn('It\'s a grave...')
                    return;
                }

            }
        }


        if (time >= 600 && getSelectedZombie() === 'grave') {
            return;
        }

        if (resourcesZombies >= getSelectedZombieCost()) {
            sock.emit('gameFieldAddZombie', ({name: getSelectedZombie(), x: gridPositionX, y: gridPositionY}));

            // alternative maybe: verzendt naam, x en y naar de server
            // server voegt die toe aan de array en stuurt de array terug
            // client maakt object met naam (switch statement) en x, y
            // verwijderen???
            // verzendt index naar de server
            // server zoekt op de index en verwijderd die plaats en stuurt terug de array
            // index client == index server
        }
    } else {
        console.log('You are currently spectating');
    }
});

// Eventlistener die kijkt welke seedslot je selecteerd met de cijfertoetsen
canvas.addEventListener('keypress', (e) => {
    // console.log(e.code);
    if (currentRole === 'Plants') {
        switch (e.code) {
            case 'Digit1': selectedSeedSlots.plant = 0; break;
            case 'Digit2': selectedSeedSlots.plant = 1; break;
            case 'Digit3': selectedSeedSlots.plant = 2; break;
            case 'Digit4': selectedSeedSlots.plant = 3; break;
            case 'Digit5': selectedSeedSlots.plant = 4; break;
            case 'Digit6': selectedSeedSlots.plant = 5; break;
            default: selectedSeedSlots.plant = null; break;
        }
    }
    if (currentRole === 'Zombies') {
        switch (e.code) {
            case 'Digit1': selectedSeedSlots.zombie = 0; break;
            case 'Digit2': selectedSeedSlots.zombie = 1; break;
            case 'Digit3': selectedSeedSlots.zombie = 2; break;
            case 'Digit4': selectedSeedSlots.zombie = 3; break;
            case 'Digit5': selectedSeedSlots.zombie = 4; break;
            case 'Digit6': selectedSeedSlots.zombie = 5; break;
            default: selectedSeedSlots.zombie = null; break;
        }
    }

    sock.emit('selectedSeedSlot', (JSON.stringify(selectedSeedSlots)));
});

// Functie die kijkt welke seedslot er geselecteerd is en de juiste plant eraan toevoegt
function getSelectedPlant() {
    switch (selectedSeedSlots.plant) {
        case 0: return 'sunflower';
        case 1: return 'peashooter';
        case 2: return 'repeater';
        case 3: return 'wallnut';
        case 4: return 'snowpea';
        case 5: return 'chomper';
    }
}

// Functie die kijkt welke seedslot er geselecteerd is en de juiste plant cost eraan toevoegt
function getSelectedPlantCost() {
    switch (selectedSeedSlots.plant) {
        case 0: return 50;
        case 1: return 100;
        case 2: return 150;
        case 3: return 50;
        case 4: return 175;
        case 5: return 150;
    }
}

// Functie die kijkt welke seedslot er geselecteerd is en de juiste zombie eraan toevoegt
function getSelectedZombie() {
    switch (selectedSeedSlots.zombie) {
        case 0: return 'grave';
        case 1: return 'normalZombie';
        case 2: return 'coneheadZombie';
        case 3: return 'bucketheadZombie';
        case 4: return 'newspaperZombie';
        case 5: return 'polevaultingZombie';
    }
}

// Functie die kijkt welke seedslot er geselecteerd is en de juiste zombie cost eraan toevoegt
function getSelectedZombieCost() {
    switch (selectedSeedSlots.zombie) {
        case 0: return 50;
        case 1: return 50;
        case 2: return 75;
        case 3: return 125;
        case 4: return 100;
        case 5: return 100;
    }
}

function Cooldown() {
    var timeLeft = this.cooldown;
    //   var elem = canvas.addEventListener(click,(e)=>{
    //   const {x, y} = getMouseCoordinates(canvas, e);
    //   const gridPositionX = x - (x % CELL_SIZE.width);
    //   const gridPositionY = y - (y % CELL_SIZE.height);
    //   });
    var timerId = setInterval(countdown, 1000);

    function countdown() {
        if (timeLeft === -1) {
            clearTimeout(timerId);
            //Kan weer zombie/plant toevoegen
        } else {
            elem.innerHTML = 'wait: ' + timeLeft;
            timeLeft--;
            //Niet knn toevoegen van zombies/planten
        }
    }
}

// Overloopt alle planten op het speelveld en tekent ze
// eventueel wordt de update() functie van een plant uitgevoerd
function drawPlants() {
    for (let i = 0; i < plants.length; i++) {
        // console.log(plants[i])
        if (plants[i]) {
            plants[i].update();
            plants[i].draw();

        }

        for (let j = 0; j < zombies.length; j++) {
            if (zombies[j] && plants[i] && collision(zombies[j], plants[i])) {
                zombies[j].walkSpeed = 0;
                plants[i].health -= 0.4;
            }

            if (zombies[j] && plants[i] && plants[i].health <= 0) {
                // sock.emit('gameFieldRemovePlant', (i));
                const zombiesSamePosition = getZombiesSamePosition(zombies[j].x);
                zombiesSamePosition.forEach(zombie => {
                    zombie.walkSpeed = zombie.speed;
                })
                zombies[j].walkSpeed = zombies[j].speed;
                plants.splice(i, 1);
                i--;
            }
        }

        // for (let j = 0; j < zombies.length; j++) {
        //     if (zombies[j] && plants[i] && zombies[j].y == plants[i].y) {
        //         plants[i].isShooting = true;
        //     }
        // }
    }
}

function getZombiesSamePosition(x) {
    const zombiesSamePosition = [];
    zombies.forEach(zombie => {
        if (zombie.x === x) {
            zombiesSamePosition.push(zombie);
        }
    });
    return zombiesSamePosition;
}

// Overloopt alle zombies op het speelveld en tekent ze
// eventueel wordt de update() functie van een zombie uitgevoerd
function drawZombies() {
    
    for (let i = 0; i < zombies.length; i++) {
        if (zombies[i]) {
            zombies[i].update();
            zombies[i].draw();

            if (zombies[i].x < CELL_SIZE.width) {
                sock.emit('win', 'Zombies');
                winner = 'Zombies';
            }

            for (let k = 0; k < lawnmowers.length; k++) {
                if (lawnmowers[k] && zombies[i] && collision(zombies[i], lawnmowers[k])) {
                    lawnmowers[k].isMoving = true;
                }
            }

            if (zombies[i].health <= 0) {
                zombies.splice(i, 1);
                i--;
                // sock.emit('gameFieldRemoveZombie', (i));
            }

        }

    }
}

// Overloopt alle lawnmowers en targets op het speelveld en tekent ze
// eventueel wordt de update() functie uitgevoerd
function drawGoals() {
    for (let i = 0; i < lawnmowers.length; i++) {
        if (lawnmowers[i]) {
            lawnmowers[i].update();
            lawnmowers[i].draw();

            if (lawnmowers[i].x > canvas.width) {
                lawnmowers.splice(i, 1);
                i--;
                sock.emit('gameFieldRemoveLawnmower', (i));
            }


            for (let j = 0; j < zombies.length; j++) {
                if (lawnmowers[i] && zombies[j] && !(zombies[j] instanceof Zombie.Grave) && collision(lawnmowers[i], zombies[j])) {
                    zombies.splice(j, 1);
                    j--;
                    sock.emit('gameFieldRemoveZombie', (j));
                }
            }
        }
    }
    for (let i = 0; i < targets.length; i++) {
        if (targets[i]) {
            targets[i].draw();

            if (targets[i].health <= 0) {
                targets.splice(i, 1);
                i--;
                sock.emit('gameFieldRemoveTarget', (i));
            }
            if (targets.length < 3) {
                sock.emit('win', 'Plants');
                winner = 'Plants';
            }

        }
    }
}

// Tekent de huidige hoeveelheid resources voor planten en zombies
function drawResources() {
    context.fillStyle = 'black'
    context.font = '25px Arial';
    context.fillText(resourcesPlants, SEEDSLOT_SIZE.width / 2, SEEDSLOT_SIZE.height + 3, SEEDSLOT_SIZE.width);
    context.fillText(resourcesZombies, canvas.width - SEEDSLOT_SIZE.width - 10, SEEDSLOT_SIZE.height + 3, SEEDSLOT_SIZE.width);
}

// Tekent de geselecteerde seedslots bovenaan
function drawSelectedSeedSlots() {
    // Als er een seedslot geselecteerd is, zoek de seedslot in de grid met de index van het object selectedSeedSlots
    // en kleur het in.
    if (selectedSeedSlots.plant !== null) {
        seedBankGridPlants[selectedSeedSlots.plant].drawSelected('red');
    }
    if (selectedSeedSlots.zombie !== null) {
        seedBankGridZombies[selectedSeedSlots.zombie].drawSelected('blue');
    }
}


function drawProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        if (projectiles[i] && projectiles[i].x > canvas.width) {
            projectiles.splice(i, 1);
            i--;
        }

        for (let j = 0; j < zombies.length; j++) {
            if (zombies[j] && projectiles[i] && collision(projectiles[i], zombies[j])) {
                const special = getSpecial(projectiles[i]);
                zombies[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        }

        for (let k = 0; k < targets.length; k++) {
            if (projectiles[i] && targets[k] && collision(projectiles[i], targets[k])) {
                targets[k].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        }
    }
}

function getSpecial(projectile) {
    if (!projectile.special) {
        return;
    }
    console.log(projectile.special)
}

// Bij het ontvangen van een nieuwe rol wordt deze toegekend aan de client
sock.on('role', role => {
    currentRole = role;
    console.warn('changed role: ', currentRole);
});


// Als de server iets doorstuurt van nieuwe plant, zombie ...
// wordt die toegevoegd/verwijderd op de client array
sock.on('gameFieldAddPlant', plantsInfo => {
    plantsInfo = JSON.parse(plantsInfo);
    plants.push(createPlant(plantsInfo.plant.name, plantsInfo.plant.x, plantsInfo.plant.y));
    resourcesPlants = plantsInfo.resources;
});
sock.on('gameFieldAddZombie', zombiesInfo => {
    zombiesInfo = JSON.parse(zombiesInfo);
    zombies.push(createZombie(zombiesInfo.zombie.name, zombiesInfo.zombie.x, zombiesInfo.zombie.y, zombiesInfo.zombie.id));
    resourcesZombies = zombiesInfo.resources;
});

sock.on('gameFieldSetSun', plantInfo => {
    plantInfo = JSON.parse(plantInfo);
    plants[plantInfo.index].hasSun = false;
    plants[plantInfo.index].timer = 0;
    resourcesPlants = plantInfo.sun;
});
sock.on('gameFieldSetBrains', zombieInfo => {
    zombieInfo = JSON.parse(zombieInfo);
    zombies[zombieInfo.index].hasBrains = false;
    zombies[zombieInfo.index].timer = 0;
    resourcesZombies = zombieInfo.brains;
});

sock.on('gameFieldPassiveResources', resources => {
    resources = JSON.parse(resources);
    resourcesPlants = resources.sun;
    resourcesZombies = resources.brains;
});
sock.on('time', (timer) => {
    time = timer;
})

// sock.on('gameFieldRemovePlant', index => {
//     plants.splice(index, 1);
// });
// sock.on('gameFieldRemoveZombie', index => {
//     zombies.splice(index, 1);
// });

// sock.on('gameFieldRemoveLawnmower', index => {
//     lawnmowers.splice(index, 1);
// });
// sock.on('gameFieldRemoveTarget', index => {
//     targets.splice(index, 1);
// });

sock.on('gameFieldReset', gameField => {
    gameField = JSON.parse(gameField);
    console.warn(gameField)

    currentRole = "Zombies"; 
    resourcesPlants = gameField.resourcesPlants; 
    resourcesZombies = gameField.resourcesZombies;
    plants = gameField.plants; 
    zombies = gameField.zombies; 
    winner = gameField.winner;    

    projectiles = [];
    lawnmowers = [];
    targets = [];

    gameField.lawnmowers.forEach(lawnmower => {
        lawnmowers.push(new Goal.Lawnmower(lawnmower.x, lawnmower.y));
    });

    gameField.targets.forEach(target => {
        targets.push(new Goal.Target(target.x, target.y));
    });
});

sock.on('selectedSeedSlot', selectedSeedSlot => {
    selectedSeedSlots = JSON.parse(selectedSeedSlot);
});

function createPlant(name, x, y) {
    switch (name) {
        case 'sunflower':
            return new Plant.Sunflower(x, y);
        case 'peashooter':
            return new Plant.Peashooter(x, y);
        case 'repeater':
            return new Plant.Repeater(x, y);
        case 'wallnut':
            return new Plant.Wallnut(x, y);
        case 'tallnut':
            return new Plant.Tallnut(x, y);
        case 'snowpea':
            return new Plant.Snowpea(x, y);
        case 'potatomine':
            return new Plant.PotatoMine(x, y);
        case 'cherrybomb':
            return new Plant.CherryBomb(x, y);
        case 'chomper':
            return new Plant.Chomper(x, y);
        case 'squash':
            return new Plant.Squash(x, y);
        case 'jalapeno':
            return new Plant.Jalapeno(x, y);
        case 'pumpkin':
            return new Plant.Pumpkin(x, y);
        case 'torchwood':
            return new Plant.Torchwood(x, y);

    }
}

// function createZombie(name, x, y, id) {
//     return new Promise((resolve, reject) => {
//         switch (name) {
//             case 'grave':
//                 resolve(new Zombie.Grave(x, y, id));
//             case 'normalZombie':
//                 resolve(new Zombie.NormalZombie(x, y, id));
//             case 'coneheadZombie':
//                 resolve(new Zombie.ConeheadZombie(x, y, id));
//             case 'bucketheadZombie':
//                 resolve(new Zombie.BucketheadZombie(x, y, id));
//             case 'newspaperZombie':
//                 resolve(new Zombie.NewspaperZombie(x, y, id));
//             case 'polevaultingZombie':
//                 resolve(new Zombie.PolevaultingZombie(x, y, id));
//         }
//     }) 
// }

function createZombie(name, x, y, id) {
    switch (name) {
        case 'grave':
            return new Zombie.Grave(x, y, id);
        case 'normalZombie':
            return new Zombie.NormalZombie(x, y, id);
        case 'coneheadZombie':
            return new Zombie.ConeheadZombie(x, y, id);
        case 'bucketheadZombie':
            return new Zombie.BucketheadZombie(x, y, id);
        case 'newspaperZombie':
            return new Zombie.NewspaperZombie(x, y, id);
        case 'polevaultingZombie':
            return new Zombie.PolevaultingZombie(x, y, id);
    }
}


function update() {
    if (!winner) {
        drawBackground();
        drawSeedBanks();
        // drawGameGrid();
        drawPlants();
        drawZombies();
        drawGoals();
        drawProjectiles();
        drawResources();
        test()
        currentFrame++;
    }
    drawSelectedCells(currentMousePositions);
    drawSelectedSeedSlots();
    drawCursors(currentMousePositions);
    requestAnimationFrame(update);
}

update();


function test() {
// console.log(lawnmowers);
// console.log(winner);
// console.error('zombies', zombies)
}
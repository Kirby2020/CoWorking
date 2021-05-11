import { context, seedBankGridPlants, seedBankGridZombies, seedBankPlants, seedBankZombies, SEEDSLOT_SIZE } from './constants.js';
import { CellSeedBank } from './classes/Cell.js';
import { loadImage } from './loaders.js';

let seedBankPlantGraphic;
let seedBankZombieGraphic;


loadImage('./assets/images/gui/seedBankPlants.png')
.then(image => {
    seedBankPlantGraphic = image;
}); 

loadImage('./assets/images/gui/seedBankZombies.png')
.then(image => {
    seedBankZombieGraphic = image;
}); 




// Maakt in het geheugen een grid op de seedbanks met cellen
function createSeedBankGridPlants() {
    for (let y = seedBankPlants.y; y <= 1 * SEEDSLOT_SIZE.height; y += SEEDSLOT_SIZE.height) {
        for (let x = seedBankPlants.x + SEEDSLOT_SIZE.width + 25; x < seedBankPlants.x + 7 * SEEDSLOT_SIZE.width; x += SEEDSLOT_SIZE.width + 5) {
            seedBankGridPlants.push(new CellSeedBank(x, y));
        }
    }    
}
function createSeedBankGridZombies() {
    for (let y = seedBankZombies.y; y <= 1 * SEEDSLOT_SIZE.height; y += SEEDSLOT_SIZE.height) {
        for (let x = seedBankZombies.x + 10; x < seedBankZombies.x + 6 * SEEDSLOT_SIZE.width; x += SEEDSLOT_SIZE.width + 5) {
            seedBankGridZombies.push(new CellSeedBank(x, y));
        }
    }    
}

createSeedBankGridPlants();
createSeedBankGridZombies();

// Tekent de grid op de seedbanks
function drawSeedBanksGrid() {
    for (let i = 0; i < seedBankGridPlants.length; i++) {
        let seedBankCell = seedBankGridPlants[i]
        seedBankCell.draw();

        let sprite = new Image();
        sprite.src = Object.values(plantSprites)[i];

        context.drawImage(sprite, seedBankCell.x, seedBankCell.y, seedBankCell.width, seedBankCell.height);

        context.fillStyle = 'gold';
        context.font = '40px Arial';
        context.fillText(Math.floor(Object.values(plantCosts)[i]), seedBankCell.x, seedBankCell.y + seedBankCell.height);
    }
    for (let i = 0; i < seedBankGridZombies.length; i++) {
        let seedBankCell = seedBankGridZombies[i]
        seedBankCell.draw();

        let sprite;
        try {
            sprite = new Image();
            sprite.src = Object.values(zombieSprites)[i];

            context.drawImage(sprite, seedBankCell.x, seedBankCell.y, seedBankCell.width, seedBankCell.height);

            context.fillStyle = 'gold';
            context.font = '40px Arial';
            context.fillText(Math.floor(Object.values(zombieCosts)[i]), seedBankCell.x, seedBankCell.y + seedBankCell.height);
    }
    catch (error) {

    }
    }
}

// Tekent de achtergrond voor de seedbanks
function drawSeedBanksBackground() {
    if (!seedBankPlantGraphic || !seedBankZombieGraphic) {
        return;
    }

    context.drawImage(seedBankPlantGraphic, seedBankPlants.x, seedBankPlants.y, seedBankPlants.width, seedBankPlants.height);
    context.drawImage(seedBankZombieGraphic, seedBankZombies.x, seedBankZombies.y, seedBankZombies.width, seedBankZombies.height);

}

const plantSprites = {
    sunflower: './assets/images/plants/seedslots2/sunflowerSeedSlotSprite2.png',
    peashooter: './assets/images/plants/seedslots2/peashooterSeedSlotSprite2.png',
    repeater: './assets/images/plants/seedslots2/repeaterSeedSlotSprite2.png',
    wallnut: './assets/images/plants/seedslots2/wallnutSeedSlotSprite2.png',
    snowpea: './assets/images/plants/seedslots2/snowpeaSeedSlotSprite2.png',
    chomper: './assets/images/plants/seedslots2/chomperSeedSlotSprite2.png'
}

const plantCosts = {
    sunflower: 50,
    peashooter: 100,
    repeater: 150,
    wallnut: 50,
    snowpea: 175,
    chomper: 150
}

const zombieSprites = {
    grave: './assets/images/zombies/seedslots/gravestoneSeedSlot.png',
    normalZombie: './assets/images/zombies/seedslots/normalZombieSeedSlot.png',
    coneheadZombie: './assets/images/zombies/seedslots/coneheadZombieSeedSlot.png',
    bucketheadZombie: './assets/images/zombies/seedslots/bucketheadZombieSeedSlot.png',
    newspaperZombie: './assets/images/zombies/seedslots/newspaperZombieSeedSlot.png',
    polevaultingZombie: './assets/images/zombies/seedslots/polevaultingZombieSeedSlot.png'
}

const zombieCosts = {
    grave: 50,
    normalZombie: 50,
    coneheadZombie: 75,
    bucketheadZombie: 125,
    newspaperZombie: 100,
    polevaultingZombie: 100
}


// export functie dat alles tekent van de seedbanks
export function drawSeedBanks() {
    drawSeedBanksBackground();
    drawSeedBanksGrid();
}
import { context, seedBankGridPlants, seedBankGridZombies, seedBankPlants, seedBankZombies, SEEDSLOT_SIZE } from './constants.js';
import { CellSeedBank } from './classes/Cell.js';

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
        seedBankGridPlants[i].draw();
    }
    for (let i = 0; i < seedBankGridZombies.length; i++) {
        seedBankGridZombies[i].draw();
    }
}

// Tekent de achtergrond voor de seedbanks
function drawSeedBanksBackground() {
    // context.fillStyle = seedBankPlants.color;
    // context.fillRect(seedBankPlants.x, seedBankPlants.y, seedBankPlants.width, seedBankPlants.height);

    // context.fillStyle = seedBankZombies.color;
    // context.fillRect(seedBankZombies.x, seedBankZombies.y, seedBankZombies.width, seedBankZombies.height);

    const seedBankPlant = new Image();
    seedBankPlant.src = './assets/images/gui/seedBankPlants.png';
    context.drawImage(seedBankPlant, seedBankPlants.x, seedBankPlants.y, seedBankPlants.width, seedBankPlants.height);

    const seedBankZombie = new Image();
    seedBankZombie.src = './assets/images/gui/seedBankZombies.png';
    context.drawImage(seedBankZombie, seedBankZombies.x, seedBankZombies.y, seedBankZombies.width, seedBankZombies.height);
}

// export functie dat alles tekent van de seedbanks
export function drawSeedBanks() {
    drawSeedBanksBackground();
    drawSeedBanksGrid();
}
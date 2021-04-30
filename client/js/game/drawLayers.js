import { loadImage } from './loaders.js';
import { canvas, context, seedBankPlants, seedBankZombies, gameGrid } from './constants.js';

// TEMP Laad de achtergrond
export function drawBackground() {
    loadImage('./assets/images/backgrounds/background2.jpg')
    .then(image => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
    });    
}

// Tekent de cursor op het scherm
export function drawCursor(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x, y, 20, 20);
}

// Tekent de lege seedbanks voor zowel de planten als de zombies
export function drawSeedBanks() {
    context.fillStyle = seedBankPlants.color;
    context.fillRect(100, 10, seedBankPlants.width, seedBankPlants.height);

    context.fillStyle = seedBankZombies.color;
    context.fillRect(canvas.width - 100 - seedBankZombies.width, 10, seedBankZombies.width, seedBankZombies.height);
}
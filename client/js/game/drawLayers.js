import { loadImage } from './loaders.js';
import { canvas, context, seedBankPlants, seedBankZombies, gameGrid, seedBankGridPlants, seedBankGridZombies } from './constants.js';

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


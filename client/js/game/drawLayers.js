// import { loadImage } from './loaders.js';
import { canvas, context, seedBankPlants, seedBankZombies, gameGrid, seedBankGridPlants, seedBankGridZombies, CELL_SIZE } from './constants.js';
import { isIn } from './utils.js';


// TEMP Laad de achtergrond
export function drawBackground() {

    const background = new Image();
    background.src = './assets/images/backgrounds/background2.jpg'
    context.drawImage(background, 0, 0, canvas.width, canvas.height);


    context.strokeStyle = 'red';
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(9 * CELL_SIZE.width, 1 * CELL_SIZE.height);
    context.lineTo(9 * CELL_SIZE.width, 6 * CELL_SIZE.height + 16);
    context.stroke();
}

// Tekent de cursor op het scherm
function drawCursor(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x, y, 20, 20);
}

// Krijgt alle cursors binnen en tekent ze op het scherm
export function drawCursors(cursors) {
    if (cursors) {          
        cursors.forEach(cursor => {
            drawCursor(cursor.x, cursor.y, cursor.color);
        });
    }
}

// Tekent alle geselecteerde cells
export function drawSelectedCells(mousePositions) {
    mousePositions.forEach(mousePos => {
        gameGrid.forEach(cell => {
            if (cell && isIn(mousePos, cell)) {
                cell.drawSelected();
            }
        });
        seedBankGridPlants.forEach(cell => {
            if (cell && isIn(mousePos, cell)) {
                cell.drawSelected();
            }
        });
        seedBankGridZombies.forEach(cell => {
            if (cell && isIn(mousePos, cell)) {
                cell.drawSelected();
            }
        });
    });
}

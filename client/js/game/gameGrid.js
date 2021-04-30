import { CELL_SIZE, gameGrid } from './constants.js';
import { Cell } from './classes/Cell.js'


function createGameGrid() {
    for (let y = CELL_SIZE.height + 10; y <= 6 * CELL_SIZE.height; y += CELL_SIZE.height) {
        for (let x = 3 * CELL_SIZE.width; x <= 11 * CELL_SIZE.width; x += CELL_SIZE.width) {
            gameGrid.push(new Cell(x, y))
        }
    }
}
createGameGrid();

export function drawGameGrid() {
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}
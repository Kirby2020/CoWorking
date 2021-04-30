import { context, CELL_SIZE, gameGrid } from './constants.js';

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CELL_SIZE.width;
        this.height = CELL_SIZE.height;
    }
    draw() {
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}

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
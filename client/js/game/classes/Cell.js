import { context, CELL_SIZE } from '../constants.js';

export class Cell {
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
    drawSelected(color) {
        context.strokeStyle = color || 'white';
        context.lineWidth = 4;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}
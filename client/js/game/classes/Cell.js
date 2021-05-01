import { context, CELL_SIZE, SEEDSLOT_SIZE, gameGrid, seedBankGridPlants, seedBankGridZombies, CELL_GAP } from '../constants.js';

export class Cell {
    // Maakt een cell aan met gegeven x en y coördinaten
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CELL_SIZE.width;
        this.height = CELL_SIZE.height;
    }
    // Tekent een cell
    draw() {
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
    // Tekent een geselecteerde cell
    drawSelected(color) {
        context.strokeStyle = color || 'white';
        context.lineWidth = 4;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}

export class CellSeedBank extends Cell {
    // Maakt een cell aan maar dan met een andere breedte
    constructor(x, y, width, height) {
        super(x, y);
        this.width = SEEDSLOT_SIZE.width;
        this.height = SEEDSLOT_SIZE.height; // Gaat waarschijnlijk nog weg
    }
}



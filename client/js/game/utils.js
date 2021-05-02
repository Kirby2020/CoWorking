import { CELL_GAP } from './constants.js';

// Kijkt of er collision is tussen een positie en een cell
export function isIn(pos, cell) {
    if (pos.x > cell.x - CELL_GAP && pos.x < cell.x - CELL_GAP + cell.width) {
        if (pos.y > cell.y - CELL_GAP && pos.y < cell.y - CELL_GAP + cell.height) {
            return true;
        }
    }
}
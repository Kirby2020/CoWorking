import {CELL_GAP, CELL_SIZE} from './constants.js';

// Kijkt of er collision is tussen een positie en een cell
export function collision(object1, object2) {
    if (    !(  object1.x > object2.x + object2.width ||
                object1.x + object1.width < object2.x ||
                object1.y > object2.y + object2.height ||
                object1.y + object1.height < object2.y
            )
        ) {
            return true;
    }
}

export function isOutOfBounds(object) {
    if (object.x < (CELL_SIZE.width) ||
        object.x > (13 * CELL_SIZE.width) ||
        object.y < (CELL_SIZE.height + 10) ||
        object.y > (5 * CELL_SIZE.height + 10))
    {
        console.log(object.name + ' is out of bounds');
        return true;
    }
}
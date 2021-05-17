import { CELL_SIZE, context } from "../constants.js";

export class Projectile {
    constructor(x, y, special, sprite) {
        this.x = x + CELL_SIZE.width;
        this.y = y + CELL_SIZE.height / 5;
        this.width = 10;
        this.height = 10;
        this.power = 10; // Default waarde voor projectile damage
        this.speed = 5;
        this.special = special;
        this.sprite = sprite;
    }

    update() {
        this.x += this.speed;
    }
    
    draw() {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, this.x, this.y, this.width + 20, this.width + 20);
    }
}
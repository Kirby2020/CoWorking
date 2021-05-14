import { CELL_SIZE, context } from "../constants.js";

export class Projectile {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.power = 10; // Default waarde voor projectile damage
        this.speed = 5;
        this.sprite = sprite;
    }

    update() {
        this.x += this.speed;
    }
    
    draw() {
        // context.strokeStyle = 'darkgreen';
        // context.fillStyle = 'green';
        // context.lineWidth = 1;
    
        // context.beginPath();
        // context.arc(this.x + CELL_SIZE.width, this.y + CELL_SIZE.height / 3, this.width, 0, 2 * Math.PI);
    
        // context.stroke();
        // context.fill();

        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, this.x + CELL_SIZE.width, this.y + CELL_SIZE.height / 5, this.width, this.width);
    }
}
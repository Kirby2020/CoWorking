import {context, CELL_SIZE} from '../constants.js';

export class Goal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CELL_SIZE.width;
        this.height = CELL_SIZE.height;
        this.timer = 0;
    }
}

export class Lawnmower extends Goal {
    constructor(x, y) {
        super(x, y);
        this.attackDamage = 10000;
        this.isMoving = false;
        this.speed = 5;
        this.sprite = './assets/images/plants/Lawn_Mower.png';
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, this.x, this.y, this.width, this.height);
    }
}

export class Target extends Goal {
    constructor(x, y) {
        super(x, y);
        this.health = 200;
        this.sprite = './assets/images/zombies/target_1.png';
    }

    draw() {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, this.x, this.y, this.width, this.height);

        context.fillStyle = 'red';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height)
    }
}
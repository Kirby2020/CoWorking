import { context, CELL_SIZE, SEEDSLOT_SIZE } from '../constants.js';


class Zombie {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;

        this.width = CELL_SIZE.width;
        this.height = CELL_SIZE.height;

        this.seedslotWidth = SEEDSLOT_SIZE.width;
        this.seedslotHeight = SEEDSLOT_SIZE.height;

        this.isAttacking = false;
        this.isMoving = false;
        this.timer = 0;
    }
    draw(){
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, this.x, this.y, this.width, this.height);

        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height)
    }
    update(){
        if (this.isAttacking === false) {
            this.x -= this.speed;
        }
    }
}

export class Grave extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 1000;
        this.cooldown = 5;
        this.cost = 50;
        this.speed = 0;
        this.sprite = './assets/images/zombies/gravestone/Zombie_Gravestone1.png';
        this.seedSlotSprite = './assets/images/zombies/gravestone/Zombie_Gravestone1.png';
    }
}

export class NormalZombie extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 100;

        this.attackDamage = 10; 

        this.attackSpeed = 1;
        this.speed = 0.75;
        this.walkSpeed = this.speed;
        
        this.cooldown = 8;
        this.cost = 50;
        this.sprite = './assets/images/zombies/normal_zombie/normal_zombie_standing.png';
        this.seedSlotSprite = './assets/images/zombies/normal_zombie/normal_zombie_standing.png';
    }

    draw () {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, 0, 0, 28, 44, this.x, this.y, 28 * 2, 44 * 2);

        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height)
    }
}
export class NewspaperZombie extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 100;
        this.shield = 200;

        this.attackDamage = 10;
        this.attackSpeed = 0.75;

        this.speed = 2;
        this.walkSpeed = this.speed;

        this.cooldown = 15;
        this.cost = 100;
        this.sprite = './assets/images/zombies/conehead_zombie/conehead_zombie_standing.png';
        this.seedSlotSprite = './assets/images/zombies/conehead_zombie/conehead_zombie_standing.png';

        this.special = {effect: 'rage', duration: 0, multiplier: 2};
    }

    draw () {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, 0, 0, 28, 44, this.x, this.y, 28 * 2, 44 * 2);

        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height)
    }
}
export class ConeheadZombie extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 200;

        this.attackDamage = 10;
        this.attackSpeed = 0.75;

        this.speed = 2;
        this.walkSpeed = this.speed;

        this.cooldown = 15;
        this.cost = 75;
        this.sprite = './assets/images/zombies/conehead_zombie/conehead_zombie_standing.png';
        this.seedSlotSprite = './assets/images/zombies/conehead_zombie/conehead_zombie_standing.png';
    }

    draw () {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, 0, 0, 28, 44, this.x, this.y, 28 * 2, 44 * 2);

        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height)
    }
}
export class BucketheadZombie extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 400;

        this.attackDamage = 10;
        this.attackSpeed = 0.75;

        this.speed = 2;
        this.walkSpeed = this.speed;

        this.cooldown = 20;
        this.cost = 125;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;
    }
}

export class PolevaultingZombie extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 150;

        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;

        this.speed = 4;
        this.walkSpeed = this.speed;

        this.cooldown = cooldown;
        this.cost = 100;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;

        this.special = {effect: 'jump', amount: 1};
    }
}

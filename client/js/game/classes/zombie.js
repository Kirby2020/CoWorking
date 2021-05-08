import { context, CELL_SIZE, SEEDSLOT_SIZE } from '../constants.js';


class Zombie {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = CELL_SIZE.width;
        this.height = CELL_SIZE.height;
        
        this.seedslotWidth = SEEDSLOT_SIZE.width;
        this.seedslotHeight = SEEDSLOT_SIZE.height;

        this.isAttacking = false;
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
        this.x--;
    }
}

export class Grave extends Zombie {
    constructor(x,y) {
        super(x, y);

        this.health = 1000;
        this.cooldown = 5;
        this.cost = 50;
        this.sprite = './assets/images/zombies/gravestone/Zombie_Gravestone1.png';
        this.seedSlotSprite = './assets/images/zombies/gravestone/Zombie_Gravestone1.png';
    }
}

export class NormalZombie extends Zombie {
    constructor(x, y) {
        super(x, y);

        this.health = 100;

        this.attackDamage = 10; 

        this.attackSpeed = 0.75;
        this.speed = 2;
        this.walkSpeed = this.speed; //Ik vond online dat die er 4 stappen overdeed om 1 vakje te verlopen. Ik weet niet hoe snel dit juist is dus gok ik dit.
        
        this.cooldown = 8;
        this.cost = 50;
        this.sprite = './assets/images/zombies/normal_zombie/normal_zombie_standing.png';
        this.seedSlotSprite = seedSlotSprite;
    }
}
export class NewspaperZombie extends Zombie {
    constructor(x,y) {
        super(x, y);

        this.health = 100;
        this.shield = 200;

        this.attackDamage = 10;
        this.attackSpeed = 0.75;

        this.speed = 2;
        this.walkSpeed = this.speed;

        this.cooldown = 15;
        this.cost = 100;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;

        this.special = {effect: 'rage', duration: 0, multiplier: 2};
    }
}
export class ConeheadZombie extends Zombie {
    constructor(x,y) {
        super(x,y);

        this.health = 200;

        this.attackDamage = 10;
        this.attackSpeed = 0.75;

        this.speed = 2;
        this.walkSpeed = this.speed;

        this.cooldown = 15;
        this.cost = 75;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;
    }
}
export class BucketheadZombie extends Zombie {
    constructor(x,y) {
        super(x,y);

        this.health = 400;

        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;

        this.speed = 2;
        this.walkSpeed = this.speed;

        this.cooldown = 20;
        this.cost = 125;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;
    }
}

export class PolevaultingZombie extends Zombie {
    constructor(x,y) {
        super(x, y);

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
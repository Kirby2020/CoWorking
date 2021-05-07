import { CELL_SIZE, SEEDSLOT_SIZE } from '../constants.js';


class Zombie {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = x * CELL_SIZE.width;
        this.height = y * CELL_SIZE.height;

        this.seedslotWidth = x * SEEDSLOT_SIZE.width;
        this.seedslotHeight = y * SEEDSLOT_SIZE.height;

        this.isAttacking = false;
        this.timer = 0;
    }
    draw(){

    }
    update(){

    }
}

class Grave extends Zombie {
    constructor(x,y) {
        super(x, y);

        this.health = 1000;
        this.cooldown = 5;
        this.cost = 50;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;
    }
}

class NormalZombie extends Zombie {
    constructor(x, y) {
        super(x, y);

        this.health = 100;

        this.attackDamage = 10; 

        this.attackSpeed = 0.75;
        this.speed = 2;
        this.walkSpeed = speed; //Ik vond online dat die er 4 stappen overdeed om 1 vakje te verlopen. Ik weet niet hoe snel dit juist is dus gok ik dit.
        
        this.cooldown = 8;
        this.cost = 50;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;
    }
}
class NewspaperZombie extends Zombie{
    constructor(x,y) {
        super(x, y);

        this.health = 100;
        this.shield = 200;

        this.attackDamage = 10;
        this.attackSpeed = 0.75;

        this.speed = 2;
        this.walkSpeed = speed;

        this.cooldown = 15;
        this.cost = 100;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;

        this.special = {effect: 'rage', duration: 0, multiplier: 2};
    }
}
class ConeheadZombie extends Zombie{
    constructor(x,y) {
        super(x,y);

        this.health = 200;

        this.attackDamage = 10;
        this.attackSpeed = 0.75;

        this.speed = 2;
        this.walkSpeed = speed;

        this.cooldown = 15;
        this.cost = 75;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;
    }
}
class BucketheadZombie extends Zombie{
    constructor(x,y) {
        super(x,y);

        this.health = 400;

        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;

        this.speed = 2;
        this.walkSpeed = speed;

        this.cooldown = 20;
        this.cost = 125;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;
    }
}

class PolevaultingZombie extends Zombie{
    constructor(x,y) {
        super(x, y);

        this.health = 150;

        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;

        this.speed = 4;
        this.walkSpeed = speed;

        this.cooldown = cooldown;
        this.cost = 100;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;

        this.special = {effect: 'jump', amount: 1};
    }
}
import { canvas, context, CELL_SIZE, gameGrid, seedBankGridPlants, seedBankGridZombies, CELL_GAP } from '../constants.js';
import {SEEDSLOT_SIZE} from "../constants";

class zombie {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = x * CELL_SIZE.width;
        this.height = y * CELL_SIZE.height;
        this.seedslotWidth = x * SEEDSLOT_SIZE.width;
        this.seedslotHeight = y * SEEDSLOT_SIZE.height;
        this.isShooting = false;
        this.projectiles = [];
        this.timer = 0;
    }
    draw(){

    }
    update(){

    }
}
//cost in brain

class zombieNormaal extends zombie {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.attackDamage = attackDamage; //Geen idee wat dit is
        this.attackSpeed = attackSpeed;
        this.walkSpeed = 2; //Ik vond online dat die er 4 stappen overdeed om 1 vakje te verlopen. Ik weet niet hoe snel dit juist is dus gok ik dit.
        this.cooldown = 5;
        this.cost = 50;
        this.sprite = sprite;
    }
}
class newsPaper extends zombie{
    constructor(x,y) {
        super(x, y);

        this.health = 420;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.walkSpeed = 2;
        this.cooldown = cooldown;
        this.cost = 50;
        this.sprite = sprite;
        this.shield= 100;
    }
}
class coneHead extends zombie{
    constructor(x,y) {
        super(x,y);

        this.health = 200;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.walkSpeed = 2;
        this.cooldown = cooldown;
        this.cost = 75;
        this.sprite = sprite;
    }
}
class bucketHead extends zombie{
    constructor(x,y) {
        super(x,y);

        this.health = 400;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.walkSpeed = 2;
        this.cooldown = cooldown;
        this.cost = 100;
        this.sprite = sprite;
    }
}

class poleVaulting extends zombie{
    constructor(x,y) {
        super(x, y);

        this.health = 420;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.walkSpeed = 1;
        this.cooldown = cooldown;
        this.cost = 100;
        this.sprite = sprite;
        this.jump= jump;
    }
}
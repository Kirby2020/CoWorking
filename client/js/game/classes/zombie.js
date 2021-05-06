import { canvas, context, CELL_SIZE, gameGrid, seedBankGridPlants, seedBankGridZombies, CELL_GAP } from './constants.js';

class zombie {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = x * CELL_SIZE.width;
        this.height = y * CELL_SIZE.height;
        this.isShooting = false;
        this.projectiles = [];
        this.timer = 0;
    }
}
class zombieNormaal extends zombie {
    constructor(x, y, attackDamage, attackSpeed, walkSpeed, cooldown, sprite,) {
        super(x, y);
        this.health = 270;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.walkSpeed = walkSpeed;
        this.cooldown = cooldown;
        this.sprite = sprite;
    }
}
class coneHead extends zombie{
    constructor(x,y, attackDamage, attackSpeed, walkSpeed, cooldown, sprite) {
        super(x,y);

        this.health = 640;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.walkSpeed = walkSpeed;
        this.cooldown = cooldown;
        this.sprite = sprite;
    }
}
class newsPaper extends zombie{
    constructor(x,y, attackDamage, attackSpeed, walkSpeed, cooldown, sprite, hasNewspaper) {
        super(x, y);

        this.health = 420;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.walkSpeed = walkSpeed;
        this.cooldown = cooldown;
        this.sprite = sprite;
        this.hasNewspaper= hasNewspaper;
    }
}
class screenDoor extends zombie{
    constructor(x,y, attackDamage, attackSpeed, walkSpeed, cooldown, sprite, hasDoor) {
        super(x,y);

        this.health = 1000;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.walkSpeed = walkSpeed;
        this.cooldown = cooldown;
        this.sprite = sprite;
        this.hasDoor= hasDoor;
    }
}
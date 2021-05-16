import { context, CELL_SIZE, SEEDSLOT_SIZE } from '../constants.js';


class Zombie {
    constructor(x, y, id) {
        this.x = x;
        this.y = y + 6;
        this.id = id;

        this.width = CELL_SIZE.width;
        this.height = CELL_SIZE.height;

        this.seedslotWidth = SEEDSLOT_SIZE.width;
        this.seedslotHeight = SEEDSLOT_SIZE.height;

        this.attackDamage = 10; 
        this.attackSpeed = 0.75;
        this.speed = 0.75;
        this.walkSpeed = this.speed;

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
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height);
        // context.fillText(Math.floor(this.timer), this.x, this.y + 25);

        // HITBOX
        context.strokeStyle = 'purple';
        context.lineWidth = 2;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
    update(){
        this.timer++;

        if (this.isAttacking === false) {
            this.x -= this.walkSpeed;
        }
    }
}

export class Grave extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 500;
        this.attackDamage = 0; 
        this.attackSpeed = 1;
        this.cooldown = 5;
        this.cost = 50;
        this.speed = 0;
        this.generateSpeed = 20;
        this.hasBrains = false;
        this.brains = 25;
        this.sprite = './assets/images/zombies/gravestone/Zombie_Gravestone1.png';
        this.seedSlotSprite = './assets/images/zombies/gravestone/Zombie_Gravestone1.png';
        this.projectileSprite = './assets/images/zombies/Brain_by_BP.png';
    }

    draw() {
        super.draw();

        if (this.hasBrains === true) {
            const sprite = new Image();
            sprite.src = this.projectileSprite;
            context.drawImage(sprite, this.x, this.y, this.width, this.width); // height = width om vierkant te houden
        }
    }

    update() {
        super.update();

        this.walkSpeed = 0;

        if (this.timer % (this.generateSpeed * 60) === 0 && this.hasBrains === false) {
            this.hasBrains = true;
        }
    }
}

export class NormalZombie extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 100;
        
        this.cooldown = 8;
        this.cost = 50;
        this.sprite = './assets/images/zombies/normal_zombie/normal_zombie_standing.png';
        this.seedSlotSprite = './assets/images/zombies/seedslots/normalZombieSeedSlot.png';
    }

    draw () {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, 0, 0, 28, 44, this.x, this.y, 28 * 2, 44 * 2);

        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height)

        // context.strokeStyle = 'purple';
        // context.lineWidth = 2;
        // context.strokeRect(this.x, this.y, this.width, this.height);
    }
}

export class ConeheadZombie extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 200;

        this.cooldown = 15;
        this.cost = 75;
        this.sprite = './assets/images/zombies/conehead_zombie/conehead_zombie_standing.png';
        this.seedSlotSprite = './assets/images/zombies/seedslots/coneheadZombieSeedSlot.png';
    }

    draw () {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, 0, 0, 28, 54, this.x, this.y, 28 * 2, 44 * 2);

        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height);
    }
}

export class NewspaperZombie extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 100;
        this.shield = 200;

        this.cooldown = 15;
        this.cost = 100;
        this.sprite = './assets/images/zombies/newspaper_zombie/newspaper_zombie_standing.png';
        this.seedSlotSprite = './assets/images/zombies/seedslots/newspaperZombieSeedSlot.png';

        this.special = {effect: 'rage', duration: 0, multiplier: 2};
    }

    draw () {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, 0, 0, 34, 53, this.x, this.y, 28 * 2, 44 * 2);

        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height);
    }
}

export class BucketheadZombie extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 400;

        this.cooldown = 20;
        this.cost = 125;
        this.sprite = './assets/images/zombies/buckethead_zombie/buckethead_zombie_standing.png';
        this.seedSlotSprite = './assets/images/zombies/seedslots/bucketheadZombieSeedSlot.png';
    }

    draw () {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, 0, 0, 30, 50, this.x, this.y, 28 * 2, 44 * 2);

        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height);
    }
}

export class PolevaultingZombie extends Zombie {
    constructor(x, y, id) {
        super(x, y, id);

        this.health = 150;
        this.speed = 1.5;
        this.walkSpeed = this.speed;

        this.cooldown = 20;
        this.cost = 100;
        this.sprite = './assets/images/zombies/polevaulting_zombie/polevaulting_zombie_standing.png';
        this.seedSlotSprite = './assets/images/zombies/seedslots/polevaultingZombieSeedSlot.png';

        this.special = {effect: 'jump', amount: 1};
    }

    draw () {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, 0, 0, 73, 52, this.x, this.y, 28 * 4, 44 * 2);

        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height);
    }
}

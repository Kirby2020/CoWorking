import { context, CELL_SIZE, SEEDSLOT_SIZE } from '../constants.js';
import { projectiles } from '../game.js';
import { Projectile } from './projectile.js';

// Geïnspireerd van https://www.youtube.com/watch?v=QxYg8-mhhhs&t=1484s
// Deze klasse wordt niet zelf gebruikt.
// Enkel ter ondersteuning voor de andere klassen.
// Heeft een teken methode en een update methode om te bewegen en/of aan te vallen
export class Plant {
    constructor(x, y) {
        this.x = x;
        this.y = y + 10;
        this.width = CELL_SIZE.width - 10;
        this.height = CELL_SIZE.height - 10;
        this.seedslotWidth = SEEDSLOT_SIZE.width;
        this.seedslotHeight = SEEDSLOT_SIZE.height;
        this.isShooting = false;
        this.projectiles = [];
        this.timer = 0;
    }

    draw() {
        const sprite = new Image();
        sprite.src = this.sprite;
        context.drawImage(sprite, this.x, this.y, this.width, this.height);

        context.fillStyle = 'red';
        context.font = '20px Arial';
        context.fillText(Math.floor(this.health), this.x, this.y + CELL_SIZE.height);
        context.fillText(Math.floor(this.timer), this.x, this.y + 25);

        // context.strokeStyle = 'purple';
        // context.lineWidth = 2;
        // context.strokeRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.timer++;

        if (this.timer % (this.attackSpeed * 60) === 0) {
            projectiles.push(new Projectile(this.x, this.y, this.special, this.projectileSprite));
        }
    }
}

// Cooldown in seconden
// Attack damage in dps
// Attack speed in seconden
// Cost in sun

// Een sunflower genereert zon om de zoveel seconden
export class Sunflower extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 100;
        this.cooldown = 5;
        this.cost = 50;
        this.generateSpeed = 20;
        this.hasSun = false;
        this.sun = 25;
        this.sprite = './assets/images/plants/seedslots2/sunflowerSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/sunflowerSeedSlotSprite2.png';   // https://www.cleanpng.com/png-plants-vs-zombies-2-it-s-about-time-plants-vs-zomb-696886/download-png.html
        this.projectileSprite = './assets/images/plants/Sun_PvZ2.png';
    }

    draw() {
        super.draw();

        if (this.hasSun === true) {
            const sprite = new Image();
            sprite.src = this.projectileSprite;
            context.globalAlpha = 0.85;
            context.drawImage(sprite, this.x, this.y, this.width + 20, this.width + 20); // height = width om vierkant te houden
            context.globalAlpha = 1;
        }
    }

    update() {
        super.update();

        if (this.timer % (this.generateSpeed * 60) === 0 && this.hasSun === false) {
            this.hasSun = true;
        }
    }

}

export class Peashooter extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 100;
        this.attackDamage = 10;
        this.attackSpeed = 1;
        this.cooldown = 10;
        this.cost = 100;
        this.sprite = './assets/images/plants/seedslots2/peashooterSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/peashooterSeedSlotSprite2.png';   // https://www.clipartmax.com/max/m2i8i8G6G6N4H7m2/
        this.projectileSprite = './assets/images/particles/ProjectilePea.png';
    }
}

export class Repeater extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 100;
        this.attackDamage = 10;
        this.attackSpeed = 0.5;
        this.cooldown = 10;
        this.cost = 150;
        this.sprite = './assets/images/plants/seedslots2/repeaterSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/repeaterSeedSlotSprite2.png';   // https://www.clipartmax.com/middle/m2i8b1Z5Z5Z5K9K9_zombies-plants-vs-zombies-2-repeater/
        this.projectileSprite = './assets/images/particles/ProjectilePea.png';
    }
}

export class Wallnut extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 1000;
        this.cooldown = 30;
        this.cost = 50;
        this.sprite = './assets/images/plants/seedslots2/wallnutSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/wallnutSeedSlotSprite2.png';   // https://www.clipartmax.com/middle/m2i8A0H7N4N4H7A0_plants-vs-zombies-2-wallnut-the-wallnut-by-illustation16-potato-plants-vs/
    }
}

export class Tallnut extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 3000;
        this.cooldown = 30;
        this.cost = 125;
        this.sprite = './assets/images/plants/seedslots2/tallnutSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/tallnutSeedSlotSprite2.png';   // https://www.clipartmax.com/max/m2i8m2Z5H7m2N4i8/
    }
}

export class Snowpea extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 100;
        this.attackDamage = 10;
        this.attackSpeed = 1;
        this.cooldown = 10;
        this.cost = 150;
        this.sprite = './assets/images/plants/seedslots2/snowpeaSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/snowpeaSeedSlotSprite2.png';   // https://www.clipartmax.com/middle/m2i8H7m2m2N4N4b1_plants-vs-zombies-2-snow-pea-by-illustation16-plants-vs-zombies-plantas/
        this.projectileSprite = './assets/images/particles/ProjectileSnowPea.png';

        this.special = {effect: 'slow', duration: 3, multiplier: 0.5};
    }
}

export class PotatoMine extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 100;
        this.attackDamage = 500;
        this.cooldown = 20;
        this.cost = 25;
        this.sprite = './assets/images/plants/seedslots2/potatomineSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/potatomineSeedSlotSprite2.png';   // https://www.clipartmax.com/middle/m2i8Z5H7b1K9i8b1_zombies-2-generator-site-%5Bnew%5D-plants-vs-pvz-2-potato-mine/

        this.special = {effect: 'range', x: 2, y: 0};
    }
}

export class CherryBomb extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 200;
        this.attackDamage = 500;
        this.cooldown = 30;
        this.cost = 150;
        this.sprite = './assets/images/plants/seedslots2/cherrybombSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/cherrybombSeedSlotSprite2.png';   // https://www.clipartmax.com/middle/m2i8i8Z5m2K9m2A0_plants-vs-zombies-cherry-bomb/

        this.special = {effect: 'range', x: 3, y: 3};
    }
}

export class Chomper extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 200;
        this.attackDamage = 100;
        this.attackSpeed = 1;
        this.cooldown = 10;
        this.cost = 175;
        this.sprite = './assets/images/plants/seedslots2/chomperSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/chomperSeedSlotSprite2.png';

        this.special = {effect: 'range', x: 2, y: 0};
    }
}

export class Squash extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 200;
        this.attackDamage = 500;
        this.cooldown = 20;
        this.cost = 50;
        this.sprite = './assets/images/plants/seedslots2/squashSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/squashSeedSlotSprite2.png';

        this.special = {effect: 'range', x: 2, y: 0};
    }
}

export class Jalapeno extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 200;
        this.attackDamage = 500;
        this.cooldown = 30;
        this.cost = 125;
        this.sprite = './assets/images/plants/seedslots2/jalapenoSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/jalapenoSeedSlotSprite2.png';

        this.special = {effect: 'range', x: 9, y: 0};
    }
}

export class Pumpkin extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 500;
        this.cooldown = 20;
        this.cost = 125;
        this.sprite = './assets/images/plants/seedslots2/pumpkinSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/pumpkinSeedSlotSprite2.png';
    }
}

export class Torchwood extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 200;
        this.cooldown = 10;
        this.cost = 75;
        this.sprite = './assets/images/plants/seedslots2/torchwoodSeedSlotSprite2.png';
        this.seedSlotSprite = './assets/images/plants/seedslots2/torchwoodSeedSlotSprite2.png';

        this.special = {effect: 'attackboost', duration: 0, multiplier: 2};
    }
}


Math.random()

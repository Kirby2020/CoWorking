import { SEEDSLOT_SIZE } from '../constants.js';
import { canvas, context, CELL_SIZE, gameGrid, seedBankGridPlants, seedBankGridZombies, CELL_GAP } from './constants.js';

// Geïnspireerd van https://www.youtube.com/watch?v=QxYg8-mhhhs&t=1484s
// Deze klasse wordt niet zelf gebruikt.
// Enkel ter ondersteuning voor de andere klassen.
// Heeft een teken methode en een update methode om te bewegen en/of aan te vallen
class Plant {
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

    draw() {

    }

    update() {

    }
}

// Cooldown in seconden
// Attack damage in dps
// Attack speed in seconden
// Cost in sun

// Een sunflower genereert zon om de zoveel seconden
class Sunflower extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 100;
        this.cooldown = 5;
        this.cost = 50;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;   // https://www.cleanpng.com/png-plants-vs-zombies-2-it-s-about-time-plants-vs-zomb-696886/download-png.html
    }
}

class Peashooter extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 100;
        this.attackDamage = 10;
        this.attackSpeed = 1;
        this.cooldown = 10;
        this.cost = 100;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;   // https://www.clipartmax.com/max/m2i8i8G6G6N4H7m2/
    }
}

class Repeater extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 100;
        this.attackDamage = 10;
        this.attackSpeed = 0.5;
        this.cooldown = 10;
        this.cost = 150;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;   // https://www.clipartmax.com/middle/m2i8b1Z5Z5Z5K9K9_zombies-plants-vs-zombies-2-repeater/
    }
}

class Wallnut extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 1000;
        this.cooldown = 30;
        this.cost = 50;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;   // https://www.clipartmax.com/middle/m2i8A0H7N4N4H7A0_plants-vs-zombies-2-wallnut-the-wallnut-by-illustation16-potato-plants-vs/
    }
}

class Tallnut extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 3000;
        this.cooldown = 30;
        this.cost = 125;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;   // https://www.clipartmax.com/max/m2i8m2Z5H7m2N4i8/
    }
}

class Snowpea extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 100;
        this.attackDamage = 10;
        this.attackSpeed = 1;
        this.cooldown = 10;
        this.cost = 150;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;   // https://www.clipartmax.com/middle/m2i8H7m2m2N4N4b1_plants-vs-zombies-2-snow-pea-by-illustation16-plants-vs-zombies-plantas/

        this.special = {effect: 'slow', duration: 3, multiplier: 0.5};
    }
}

class PotatoMine extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 100;
        this.attackDamage = 500;
        this.cooldown = 20;
        this.cost = 25;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;   // https://www.clipartmax.com/middle/m2i8Z5H7b1K9i8b1_zombies-2-generator-site-%5Bnew%5D-plants-vs-pvz-2-potato-mine/

        this.range = {x: 2, y: 0};
    }
}

class CherryBomb extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 200;
        this.attackDamage = 500;
        this.cooldown = 30;
        this.cost = 150;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;   // https://www.clipartmax.com/middle/m2i8i8Z5m2K9m2A0_plants-vs-zombies-cherry-bomb/

        this.range = {x: 3, y: 3};
    }
}

class Chomper extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 200;
        this.attackDamage = 100;
        this.attackSpeed = 1;
        this.cooldown = 10;
        this.cost = 175;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;

        this.range = {x: 2, y: 0};
    }
}

class Squash extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 200;
        this.attackDamage = 500;
        this.cooldown = 20;
        this.cost = 50;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;

        this.range = {x: 2, y: 0};
    }
}

class Jalapeno extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 200;
        this.attackDamage = 500;
        this.cooldown = 30;
        this.cost = 125;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;

        this.range = {x: 9, y: 0};
    }
}

class Pumpkin extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 500;
        this.cooldown = 20;
        this.cost = 125;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;
    }
}

class Torchwood extends Plant {
    constructor(x, y) {
        super(x, y);

        this.health = 200;
        this.cooldown = 10;
        this.cost = 75;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;

        this.special = {effect: 'attackboost', duration: 0, multiplier: 2};
    }
}
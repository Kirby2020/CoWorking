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
        this.isShooting = false;
        this.projectiles = [];
        this.timer = 0;
    }
}

// Een sunflower genereert zon om de zoveel seconden
class Sunflower extends Plant {
    constructor(x, y, sprite, seedSlotSprite) {
        super(x, y);

        this.health = 100;
        this.cooldown = 5;
        this.sprite = sprite;
        this.seedSlotSprite = seedSlotSprite;
    }
}

class Peashooter extends Plant {
    constructor(x, y, health, attackDamage, attackSpeed, cooldown, sprite) {
        super(x, y);

        this.health = health;
        this.attackDamage = attackDamage;
        this.attackSpeed = attackSpeed;
        this.cooldown = cooldown;
        this.sprite = sprite;
    }
}



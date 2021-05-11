module.exports = class GameField {
    constructor() {
        this.plants = [];
        this.zombies = [];
        this.resourcesPlants = 300;
        this.resourcesZombies = 300;
    }

    addPlant(name, x, y) {
        const plant = {name: name, x: x, y: y}
        this.plants.push(plant);
        this.resourcesPlants -= getCost(name);
        
    }

    removePlant(index) {
        this.plants.splice(index, 1);
    }

    addZombie(name, x, y) {
        const zombie = {name: name, x: x, y: y}
        this.zombies.push(zombie);
        this.resourcesZombies -= getCost(name);
    }
    

    removeZombie(index) {
        this.zombies.splice(index, 1);
    }

    reset() {
        this.plants = [];
        this.zombies = [];
        this.resourcesPlants = 300;
        this.resourcesZombies = 300;
    }
}

function getCost(name) {
    switch (name) {
        case 'sunflower': return 50;
        case 'peashooter': return 100;
        case 'repeater': return 150;
        case 'wallnut': return 50;
        case 'snowpea': return 175;
        case 'chomper': return 150;
 

        case 'grave': return 50;
        case 'normalZombie': return 100;
        case 'coneheadZombie': return 75;
        case 'bucketheadZombie': return 125;
        case 'newspaperZombie': return 100;
        case 'polevaultingZombie': return 100;
    }
}
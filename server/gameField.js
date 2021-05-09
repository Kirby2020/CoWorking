module.exports = class GameField {
    constructor() {
        this.plants = [];
        this.zombies = [];
        this.resourcesPlants = 300;
        this.resourcesZombies = 300;
    }

    addPlant(name, x, y) {
        const plant = createPlant(name, x, y);
        if (this.resourcesPlants >= plant.cost) {
            this.plants.push(plant);
            this.resourcesPlants -= plant.cost;
        }
    }

    removePlant(index) {
        this.plants.splice(index, 1);
    }

    addZombie(name, x, y) {
        const zombie = createZombie(name, x, y);
        if (resourcesZombies >= zombie.cost) {
            this.zombies.push(zombie);
            this.resourcesZombies -= zombie.cost;
        }
    }

    removeZombie(index) {
        this.zombies.splice(index, 1);
    }
}


function createPlant(name, x, y) {
    switch (name) {
        case 'sunflower': return new Sunflower(x, y);
        case 'peashooter': return new Peashooter(x, y);
    }
}

function createZombie(name, x, y) {
    switch (name) {
        case 'grave': return new Grave(x, y);
        case 'normalZombie': return new NormalZombie(x, y);
    }
}




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
        this.resourcesPlants -= plant.cost;
        
    }

    removePlant(index) {
        this.plants.splice(index, 1);
    }

    addZombie(name, x, y) {
        const zombie = {name: name, x: x, y: y}
        this.zombies.push(zombie);
        this.resourcesZombies -= zombie.cost;
    }
    

    removeZombie(index) {
        this.zombies.splice(index, 1);
    }
}
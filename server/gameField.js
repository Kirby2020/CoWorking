module.exports = class GameField {
    constructor() {
        this.plants = [];
        this.zombies = [];
        this.lawnmowers = [];
        this.targets = [];
        this.resourcesPlants = 300;
        this.resourcesZombies = 300;
    }

    // addLawnmower(x, y) {
    //     if (this.lawnmowers.length !== 5) {
    //         const lawnmower = {x: x, y: y}
    //         this.lawnmowers.push(lawnmower);
    //     }
    // }
    //
    // addTarget(x, y) {
    //     if (this.targets.length !== 3) {
    //         const target = {x: x, y: y}
    //         this.targets.push(target);
    //     }
    // }

    removeLawnmower(index) {
        if (this.lawnmowers[index]) {
            this.lawnmowers.splice(index, 1);
        }
    }

    removeTarget(index) {
        if (this.targets[index]) {   
            this.targets.splice(index, 1);
        }
    }

    addPlant(name, x, y) {
        const plant = {id: this.plants.length, name: name, x: x, y: y}
        this.plants.push(plant);
        this.resourcesPlants -= getCost(name);
        return this.plants;
    }

    removePlant(index) {
        if (this.plants[index]) {
            this.plants.splice(index, 1);
        }
    }

    addZombie(name, x, y) {
        const zombie = {id: this.zombies.length, name: name, x: x, y: y}
        this.zombies.push(zombie);
        this.resourcesZombies -= getCost(name);
        return this.zombies;
    }

    removeZombie(index) {
        if (this.zombies[index]) {
            this.zombies.splice(index, 1);
        }
    }

    reset() {
        this.plants = [];
        this.zombies = [];
        let goals = generateGoals();
        this.lawnmowers = goals[0];
        this.targets = goals[1];
        this.resourcesPlants = 300;
        this.resourcesZombies = 300;
    }
}

function generateGoals() {
    const CELL_SIZE = {width: 83, height: 93}
    let lawnmowers = [];
    let targets = [];
    let x = 2 * CELL_SIZE.width;
    let x2 = 12 * CELL_SIZE.width;
    let y = CELL_SIZE.height + 10;
    for (let i = 0; i < 5; i++) {
        lawnmowers.push({x: x, y: y});
        // if (i % 2 === 0) {
        targets.push({x: x2, y: y});
        // }
        y += CELL_SIZE.height;
    }
    return [lawnmowers, targets];
}

function getCost(name) {
    switch (name) {
        case 'sunflower':
            return 50;
        case 'peashooter':
            return 100;
        case 'repeater':
            return 150;
        case 'wallnut':
            return 50;
        case 'snowpea':
            return 175;
        case 'chomper':
            return 150;


        case 'grave':
            return 50;
        case 'normalZombie':
            return 50;
        case 'coneheadZombie':
            return 75;
        case 'bucketheadZombie':
            return 125;
        case 'newspaperZombie':
            return 100;
        case 'polevaultingZombie':
            return 100;
    }
}
export const canvas = document.getElementById('screen');
export const context = canvas.getContext('2d');
canvas.height = 600;
canvas.width = 1080;

export const CELL_SIZE = {
    width: 83,
    height: 93
}
export const SEEDSLOT_SIZE = {
    width: 66,
    height: 93
}
export const CELL_GAP = 0;
export const gameGrid = [];
export const seedBankGridPlants = [];
export const seedBankGridZombies = [];


export const seedBankPlants = {
    x: 10,
    y: 10,
    width: canvas.width / 2 - 20,
    height: SEEDSLOT_SIZE.height,
    color: 'red',
    slots: 6
};

export const seedBankZombies = {
    x: canvas.width / 2 + 10,
    y: 10,
    width: canvas.width / 2 - 20,
    height: SEEDSLOT_SIZE.height,
    color: 'blue',
    slots: 6
};
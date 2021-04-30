export const canvas = document.getElementById('screen');
export const context = canvas.getContext('2d');
canvas.height = 600;
canvas.width = 1080;

export const CELL_SIZE = {
    width: 83,
    height: 93
}
export const gameGrid = [];


export const seedBankPlants = {
    width: canvas.width / 2.5,
    height: CELL_SIZE.height,
    color: 'red',
    slots: 6
};

export const seedBankZombies = {
    width: canvas.width / 2.5,
    height: CELL_SIZE.height,
    color: 'blue',
    slots: 6
};
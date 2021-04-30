export const canvas = document.getElementById('screen');
export const context = canvas.getContext('2d');
canvas.height = 600;
canvas.width = 1080;

export const CELL_SIZE = 100;
export const gameGrid = [];
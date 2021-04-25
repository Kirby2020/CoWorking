// Gamestates: in lobby, selecting, in game, results  
// Wanneer minstens twee players dezelfde state hebben kan de game veranderen van state?

class GameState {
    constructor() {
        this.gameState = 'in lobby';
    }

    get() {
        return this.gameState;
    }

    set(gameState) {
        switch(gameState) {
            case 'in lobby': this.gameState = 'in lobby'; break;
            case 'selecting': this.gameState = 'selecting'; break;
            case 'in game': this.gameState = 'in game'; break;
            case 'results': this.gameState = 'results'; break;
            default: return;
        }
    }
}

module.exports = GameState
// Klasse waarmee je een speler kan aanmaken kan aanmaken, toevoegen of verwijderen
// Alle spelers worden in een lijst opgeslagen
// Je kan alle spelers opvragen of een enkele speler

// Player states: in lobby, selecting, in game, (loading)

module.exports = class Players {
    // constructor(username, playerState = 'in lobby') {
    //     this.players = new Set([{username, playerState}]);
    // }

    constructor() {
        this.players = new Set();
    }

    add(username, playerState = 'in lobby') {
        this.players.add({username, playerState});
    }

    remove(username) {
        this.players.delete(username)
    }

    getAll() {
        return this.players;
    }

    getOne(username) {
        if (this.players.has(username)) {
            this.players.forEach(player => {
                if (player.username === username) {
                    return player;
                }
            });
        }
        return undefined;
    }

    getState(username) {
        return this.getOne(username).playerState;
    }
}
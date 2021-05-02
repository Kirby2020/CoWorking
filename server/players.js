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

    add(username, playerState = 'in lobby', id) {
        console.log('_Add', username)
        this.players.add({username, playerState, id});
        return this.players;
    }

    remove(username) {
        return new Promise(resolve => {
            console.log('_Delete', username)
            this.players.delete(this.getOne(username));
            console.log('AFTER DELETE', this.players) 
            resolve(this.players);
        })
    }

    getAll() {
        console.log('TEST', this.players)
        return this.players;
    }

    getOne(username) {
        for (const player of this.players) {
            if (player.username === username) {
                console.log('Player found_', player);
                return player;
            }
        };
        return 'no';
    }

    getState(username) {
        return this.getOne(username).playerState;
    }

    setState(username, state) {
        const player = this.getOne(username);
        player.playerState = state;

        return player;
    }
}
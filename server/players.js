// Klasse waarmee je een speler kan aanmaken kan aanmaken, toevoegen of verwijderen
// Alle spelers worden in een lijst opgeslagen
// Je kan alle spelers opvragen of een enkele speler

class Player {
    constructor(username) {
        this.players = new Set([username]);
    }

    constructor() {
        this.players = new Set();
    }

    add(username) {
        this.players.add(username);
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
                if (player === username) {
                    return player;
                } 
            });
        }
        return undefined;
    }
}
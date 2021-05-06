module.exports = class Cursors {
    constructor() {
        this.cursors = new Set();
    }

    add(x, y, color) {
        this.cursors.add({x, y, color});
        return this.cursors;
    }

    update(color, x, y) {
        const cursor = this.getOne(color);
        cursor.x = x;
        cursor.y = y;
    }

    remove(color) {
        console.log('DELETE', color )
        return new Promise(resolve => {
            this.cursors.delete(this.getOne(color)); 
            resolve(this.cursors);
        })
    }

    getAll() {
        return this.cursors;
    }

    getOne(color) {
        for (const cursor of this.cursors) {
            if (cursor.color === color) {
                return cursor;
            }
        }
        return 'no';
    }
}
// const sock = io('http://localhost:3001');
const sock = io('https://game.jonathanvercammen.ikdoeict.be');

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    })
}

loadImage('./assets/images/backgrounds/background1.jpg')
.then(image => {
    context.drawImage(image, 0, 0);
});

function getMouseCoordinates(element, event) {
    // coördinaten van het element
    const { top, left } = element.getBoundingClientRect();
    // coördinaten van de muis t.o.v. het volledige browser window
    const { clientX, clientY } = event;
    // console.log(event)
    // console.log(clientX, clientY)
    return {
        x: clientX - left,
        y: clientY - top
    };
}


canvas.addEventListener('mousemove', (e) => {
    const { x, y } = getMouseCoordinates(canvas, e);
    sock.emit('mouse move', { x, y });

    // context.fillRect(x, y, 10, 10);
});

// Bij het ontvangen van een muisbeweging wordt deze getoond op het scherm (TESTING)
sock.on('mouse move', ({x, y}) => {
    const canvas = document.getElementById('screen');
    const context = canvas.getContext('2d');
    context.fillRect(x, y, 10, 10);
})
   

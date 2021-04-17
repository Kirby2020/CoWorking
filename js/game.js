console.log("Hello World");
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    })
}

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


loadImage('./assets/images/backgrounds/background1.jpg')
.then(image => {
    context.drawImage(image, 0, 0);

})

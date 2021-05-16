const path = require("path");
const {app, BrowserWindow} = require('electron');
require('update-electron-app')();


function createWindow() {

    // console.log('Hello from electron');

    // Create the browser window.
    let mainWindow = new BrowserWindow({
        width: 1440,
        height: 720,
        fullscreen: false
    })

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/../index.html`)

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Remove default toolbar
    mainWindow.removeMenu();

    // https://www.deviantart.com/raptor02/art/Plants-vs-Zombies-ICON-206838879
    mainWindow.setIcon(path.join(__dirname, '../assets/pvz.png'));

    // Shortcuts
    mainWindow.webContents.on('before-input-event', (event, input) => {
        // console.log(input.key)
        if (input.key === 'F11') { // F11: toggle fullscreen
            mainWindow.fullScreen = (mainWindow.fullScreen === false);
            event.preventDefault();
        }
        if (input.key === 'F12') { // F12: open DevTools
            mainWindow.webContents.openDevTools();
            event.preventDefault();
        }
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q

    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (mainWindow === null) {
        createWindow();
    }
})
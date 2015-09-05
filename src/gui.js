var app = require('app');
var path = require('path');
var BrowserWindow = require('browser-window');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    //if (process.platform != 'darwin') {
        app.quit();
    //}
});

// When Electron finishes Init
app.on('ready', function() {
    // Create the Window.
    mainWindow = new BrowserWindow({
        'title': 'EEW',
        'icon': path.join(__dirname, 'resources/icon.png'),
        'center': true,
        'width': 650,
        'height': 550,
        'resizable': false,
        'always-on-top': true,
        'fullscreen': false,
        'skip-taskbar': true
    });

    // Load the HTML File
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // Open the devtools.
    //mainWindow.openDevTools();

    // Runs when Window is Closed
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});

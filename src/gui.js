var app = require('app');
var BrowserWindow = require('browser-window');
require('crash-reporter').start();

// Keeps reference of Window Object
var mainWindow = null;

// Quits when Window is Closed
app.on('window-all-closed', function() {
    // Keeps Program Active when window closed on Mac until CMD + Q
    //if (process.platform != 'darwin') {
        app.quit();
    //}
});

// Finished Init
app.on('ready', function() {
    // Create the Window.
    mainWindow = new BrowserWindow({
        'title': 'Earthquake Alert',
        'icon': __dirname + '/resources/icon.png',
        'width': 700,
        'height': 500,
        'resizable': false,
        //'always-on-top': true,
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

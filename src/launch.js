var app = require('app'); // Module to control application life.
var BrowserWindow = require('browser-window'); // Module to create native browser window.
var Tray = require('tray');
// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OSX it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

var ipc = require('ipc');
ipc.on('alert', function(event, arg) {
  console.log(arg);  // prints "ping"
  win = new BrowserWindow({
      width: 200,
      height: 100,
      show: true,
      frame: false,
      x: 0,
      y:0
  });
  win.loadUrl('file://' + __dirname + '/popup.html');
  win.on('closed', function() {
      win = null;
  });
});

app.on('ready', function() {
    win = new BrowserWindow({
        width: 440,
        height: 770,
        show: true
    });

    win.loadUrl('file://' + __dirname + '/index.html');
    win.on('closed', function() {
        win = null;
    });

    win.on('minimize', function() {
        tray = new Tray(__dirname + '/resources/icon.png');
        tray.on('clicked', function handleClicked() {
            win.unmaximize()
            tray.destroy()
            win.show()
            win.setSkipTaskbar(false)
        })
        win.setSkipTaskbar(true)
        win.hide()
    });

    var tray = new Tray(__dirname + '/resources/icon.png');

    tray.on('clicked', function handleClicked() {
        win.unmaximize()
        tray.destroy()
        win.show()
        win.setSkipTaskbar(false)

    })

    win.setSkipTaskbar(true)



});

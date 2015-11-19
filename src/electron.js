const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
const ipc = electron.ipcMain;
const path = require('path');

const locale = require('./resources/lang.json');
const settings = require('./settings.json');
const lang = settings.lang;

var alertWindows = {};
var alertRevision = {};
var electronReady = false;

exports.BrowserWindow = BrowserWindow;
exports.app = app;
exports.Menu = Menu;
exports.Tray = Tray;
exports.ipc = ipc;
exports.alertWindows = alertWindows;
exports.alertRevision = alertRevision;
exports.electronReady = electronReady;

exports.newAbout = function(data) {
    var alertWindow = new BrowserWindow({
        'title': locale[lang].title,
        'icon': path.join(__dirname, 'resources', 'icon.png'),
        'width': 320,
        'height': 210,
        'resizable': false,
		'fullscreen': false,
        'auto-hide-menu-bar': true,
        'skip-taskbar': false
    });

    if (process.platform == 'darwin') app.dock.show();
    alertWindow.loadURL('file://' + __dirname + '/gui/about.html');
};

exports.newWindow = function(data) {
    var alertWindow = new BrowserWindow({
        'title': locale[lang].title,
        'icon': path.join(__dirname, 'resources', 'icon.png'),
        'width': 600,
        'height': 625,
        'resizable': true,
        'auto-hide-menu-bar': true,
        'skip-taskbar': true,
        'webPreferences': {
            'preload': 'https://maps.googleapis.com/maps/api/js'
        }
    });

    if (process.platform == 'darwin') app.dock.show();
    alertWindows[data.earthquake_id] = alertWindow;
    alertRevision[data.earthquake_id] = data.revision;
    alertWindow.loadURL('file://' + __dirname + '/gui/map.html');
};

exports.newSettings = function() {
    var settingsWindow = new BrowserWindow({
		'title': locale[lang].settings,
		'icon': path.join(__dirname, 'resources', 'icon.png'),
		'width': 500,
		'height': 550,
		'resizable': false,
		'fullscreen': false,
		'auto-hide-menu-bar': true,
		'skip-taskbar': false
	});

	if (process.platform == 'darwin') app.dock.show();
	settingsWindow.loadURL('file://' + __dirname + '/gui/settings.html');
};

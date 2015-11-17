var BrowserWindow = require('browser-window');
var electron = require('electron');
var app = require('app');
var Menu = require('menu');
var Tray = require('tray');
var ipc = electron.ipcMain;
var path = require('path');

var locale = require('./resources/lang.json');
var settings = require('./settings.json');
var lang = settings.lang;

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
        'resizable': false,
		'fullscreen': false,
        'auto-hide-menu-bar': true,
        'skip-taskbar': true
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

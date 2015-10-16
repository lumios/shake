var BrowserWindow = require('browser-window');
var app = require('app');
var Menu = require('menu');
var Tray = require('tray');
var ipc = require('ipc');

var locale = require('./resources/lang.json');
var settings = require('./settings.json');
var lang = settings.lang;

var alertWindows = {};
var alertRevision = {};
var electronReady = false;

module.exports = BrowserWindow;
module.exports = app;
module.exports = Menu;
module.exports = Tray;
module.exports = ipc;
module.exports = alertWindows;
module.exports = alertRevision;
module.exports = electronReady;

exports.newWindow = function(data) {
    var alertWindow = new BrowserWindow({
        'title': locale[lang].title,
        'icon': path.join(__dirname, 'resources', 'icon.png'),
        'width': 600,
        'height': 625,
        'resizable': false,
        'auto-hide-menu-bar': true,
        'skip-taskbar': true
    });

    if (process.platform == 'darwin') app.dock.show();
    alertWindows[data.earthquake_id] = alertWindow;
    alertRevision[data.earthquake_id] = data.revision;
    alertWindow.loadUrl('file://' + __dirname + '/gui/map.html');
};

exports.newSettings = function() {
    var settingsWindow = new BrowserWindow({
		'title': locale[lang].settings,
		'icon': path.join(__dirname, 'resources', 'icon.png'),
		'width': 500,
		'height': 550,
		'resizable': false,
		'auto-hide-menu-bar': true,
		'skip-taskbar': false
	});

	if (process.platform == 'darwin') app.dock.show();
	settingsWindow.loadUrl('file://' + __dirname + '/gui/settings.html');
};

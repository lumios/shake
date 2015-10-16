var socket = require('socket.io-client')('http://eew.kurisubrooks.com:3080');
var path = require('path');
var osenv = require('osenv');
var fse = require('fs-extra');
var open = require('open');
var fs = require('fs');

var app = require('app');
var Menu = require('menu');
var Tray = require('tray');
require('crash-reporter').start();

var electron = require('./electron.js');
var logger = require('./logger.js');
var notifier = require('./notifier.js');
var trigger = require('./trigger.js');
var quake = require('./quake.js');
var locale = require('./resources/lang.json');

/*
// Loads / Generates Settings
*/

var settingsPath = path.join(__dirname, 'settings.json');
var settingsFile = {"lang": "en", "min_alert": "35", "first_run": true, "night_mode": true, "dev_mode": true};

if (!fs.existsSync(settingsPath)) {
	logger.warn('Settings File doesn\'t exist, using temp file...');
	logger.warn('Generating new settings file...');
	var settings = settingsFile;

	fs.writeFile(settingsPath, JSON.stringify(settingsFile), function(error) {
		if (error) tools.error('Could not generate file: ' + error);
	}, logger.success('Settings File generated.'));
} else {
	var settings = require('./settings.json');
	logger.success('Loaded Settings.');
}

var lang = settings.lang;

/*
// Installs Notification Sounds for OS X
*/

if (process.platform === 'darwin') {
	var copy = path.join(__dirname, 'resources', 'audio');
	var paste = osenv.home() + '/Library/Sounds/';

	fse.copy(copy, paste, function(error) {
		if (error) tools.error('Error: ' + error);
		logger.success('Installed Sounds to [' + paste + ']');
	});
}

/*
// Connects to Socket
*/

socket.on('connect', function(){
	logger.success('Connected to Server.');
	notifier.notify(locale[lang].title, '', locale[lang].connect, false);
});

/*
// Receives Data from Socket
*/

socket.on('data', function(data){
	logger.debug('Earthquake Occurred, Triggering Event...');
	quake.parse(data);
});

/*
// Catches Dropped Socket
*/

socket.on('disconnect', function(){
	logger.error('Socket Dropped, Trying to reconnect...');
	notifier.notify(locale[lang].title, '', locale[lang].disconnect, false);
});

/*
// Electron's Bullshit
*/

if (process.platform == 'darwin') app.dock.hide();

app.on('ready', function() {
	electron.electronReady = true;

	if (settings.first_run) {
		electron.newSettings();
		tools.debug('First run, opening settings window...');
	}

	var appIcon = new Tray(path.join(__dirname, 'resources', 'IconTemplate.png'));
	appIcon.setPressedImage(path.join(__dirname, 'resources', 'IconPressed.png'));

	var nodev_template = [
		{label: locale[lang].contribute,click: function(){open('https://github.com/lumios/eew');}},
		{label: locale[lang].bug,click: function(){open('https://github.com/lumios/eew/issues');}},
		{type: 'separator'},
		{label: locale[lang].settings,click: function(){electron.newSettings();}},
		{label: locale[lang].help,click: function(){open('http://lumios.xyz/support.html');}},
		{label: locale[lang].quit,click: function(){notifier.debug('Closing Program due to User Request');process.exit(0);}}
	];

	var dev_template = [
		{label: locale[lang].devtools, submenu:[
			{label: locale[lang].test,click: function(){quake.parse(trigger.quake());}},
		]},
		{type: 'separator'},
		{label: locale[lang].contribute,click: function(){open('https://github.com/lumios/eew');}},
		{label: locale[lang].bug,click: function(){open('https://github.com/lumios/eew/issues');}},
		{type: 'separator'},
		{label: locale[lang].settings,click: function(){electron.newSettings();}},
		{label: locale[lang].help,click: function(){open('http://lumios.xyz/support.html');}},
		{label: locale[lang].quit,click: function(){notifier.debug('Closing Program due to User Request');process.exit(0);}}
	];

	var contextMenu;
	if (settings.dev_mode) contextMenu = Menu.buildFromTemplate(dev_template);
	else contextMenu = Menu.buildFromTemplate(nodev_template);

	appIcon.setToolTip('EEW');
	appIcon.setContextMenu(contextMenu);

	appIcon.on('clicked', function(event) {
		notifier.debug(event);
	});

});

app.on('window-all-closed', function() {
	if (process.platform == 'darwin') app.dock.hide();
	return;
});

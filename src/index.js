var socket = require('socket.io-client')('http://eew.kurisubrooks.com:3080');
var path = require('path');
var osenv = require('osenv');
var fs = require('fs-extra');
var open = require('open');

require('crash-reporter').start();

var logger = require('./logger.js');

/*
// Loads / Generates Settings
*/

var settingsPath = path.join(__dirname, 'settings.json');

if (!fs.existsSync(settingsPath)) {
	var settingsFile = {"lang": "en","min_alert": "35","first_run": true,"night_mode": false,"dev_mode": true};
	logger.warn('Settings File does not exist, generating...');

	try {fs.writeFileSync(settingsPath, JSON.stringify(settingsFile));}
	catch(error) {logger.error(error);}

	var settings = require('./settings.json');
	logger.success('Generated Settings File');
} else {
	var settings = require('./settings.json');
	logger.success('Loaded Settings.');
}

/*
// Import Modules
*/

var electron = require('./electron.js');
var notifier = require('./notifier.js');
var trigger = require('./trigger.js');
var locale = require('./resources/lang.json');
var quake = require('./quake.js');
var lang = settings.lang;

/*
// Installs Notification Sounds for OS X
*/

if (process.platform === 'darwin') {
	var copy = path.join(__dirname, 'resources', 'audio');
	var paste = osenv.home() + '/Library/Sounds/';

	fs.copy(copy, paste, function(error) {
		if (error) logger.error('Error: ' + error);
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

if (process.platform == 'darwin') electron.app.dock.hide();
var appIcon, contextMenu = null;

electron.app.on('ready', function() {
	electron.electronReady = true;

	if (settings.first_run) {
		electron.newSettings();
		logger.debug('First run, opening settings window...');
	}

	if (process.platform == 'darwin') {
		appIcon = new electron.Tray(path.join(__dirname, 'resources', 'IconTemplate.png'));
		appIcon.setPressedImage(path.join(__dirname, 'resources', 'IconPressed.png'));
	} else if (process.platform == 'win32') {
		appIcon = new electron.Tray(path.join(__dirname, 'resources', 'IconWindows.ico'));
	} else appIcon = new electron.Tray(path.join(__dirname, 'resources', 'IconPressed.png'));

	var nodev_template = [
		{label: locale[lang].about,click: function(){}},
		{type: 'separator'},
		{label: locale[lang].help,click: function(){open('http://lumios.xyz/support.html');}},
		{label: locale[lang].settings,click: function(){electron.newSettings();}},
		{type: 'separator'},
		{label: locale[lang].contribute,click: function(){open('https://github.com/lumios/eew');}},
		{label: locale[lang].bug,click: function(){open('https://github.com/lumios/eew/issues');}},
		{label: locale[lang].updates,click: function(){}},
		{type: 'separator'},
		{label: locale[lang].quit,click: function(){logger.debug('Closed via Tray Menu');process.exit(0);}}
	];

	var dev_template = [
		{label: locale[lang].about,click: function(){}},
		{type: 'separator'},
		{label: locale[lang].help,click: function(){open('http://lumios.xyz/support.html');}},
		{label: locale[lang].settings,click: function(){electron.newSettings();}},
		{type: 'separator'},
		{label: locale[lang].contribute,click: function(){open('https://github.com/lumios/eew');}},
		{label: locale[lang].bug,click: function(){open('https://github.com/lumios/eew/issues');}},
		{label: locale[lang].updates,click: function(){}},
		{type: 'separator'},
		{label: locale[lang].devtools, submenu:[
			{label: locale[lang].test,click: function(){quake.parse(trigger.quake());}},
		]},
		{type: 'separator'},
		{label: locale[lang].quit,click: function(){logger.debug('Closed via Tray Menu');process.exit(0);}}
	];

	if (settings.dev_mode) contextMenu = electron.Menu.buildFromTemplate(dev_template);
	else contextMenu = electron.Menu.buildFromTemplate(nodev_template);

	appIcon.setToolTip('EEW');
	appIcon.setContextMenu(contextMenu);
});

electron.app.on('window-all-closed', function() {
	if (process.platform == 'darwin') electron.app.dock.hide();
	return;
});

const socket = require('socket.io-client')('http://shakeserv.kurisubrooks.com:1190');
const path = require('path');
const fs = require('fs-extra');
const open = require('open');
const logger = require('lumios-toolkit');
const crashReporter = require('electron').crashReporter;

/*
crashReporter.start({
	productName: 'Shake',
	companyName: 'Lumios',
	submitURL: 'https://lumios.xyz/crash',
	autoSubmit: true
});
*/

/*
// Setting App Directories
*/

var appDir;
if (process.platform === 'win32') appDir = path.join(process.env.APPDATA, 'Shake', 'App');
else if (process.platform === 'darwin') appDir = path.join(process.env.HOME, 'Library', 'Application Support', 'Shake', 'App');
else if (process.platform === 'linux') appDir = path.join(process.env.PWD, 'shake', 'app');


/*
// Loads / Generates Settings
*/

var settingsPath = path.join(__dirname, 'settings.json');
if (!fs.existsSync(settingsPath)) {
	var settingsFile = {"lang":"en","min_alert":"35","first_run":true,"night_mode":false,"dev_mode":true};
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

const electron = require('./electron');
const notifier = require('./notifier');
const trigger = require('./trigger');
const locale = require('./resources/lang.json');
const quake = require('./quake');
const lang = settings.lang;

/*
// Installs Notification Sounds for OS X
*/

if (process.platform === 'darwin') {
	const copy = path.join(__dirname, 'resources', 'audio');
	const paste = path.join(process.env.HOME, 'Library', 'Sounds');

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
var appTray, contextMenu = null;

electron.app.on('ready', function() {
	electron.electronReady = true;

	if (settings.first_run) {
		electron.newSettings();
		logger.debug('First run, opening settings window...');
	}

	if (process.platform == 'darwin') {
		appTray = new electron.Tray(path.join(__dirname, 'resources', 'IconTemplate.png'));
		appTray.setPressedImage(path.join(__dirname, 'resources', 'IconPressed.png'));
	} else if (process.platform == 'win32') {
		appTray = new electron.Tray(path.join(__dirname, 'resources', 'IconWindows.ico'));
	} else appTray = new electron.Tray(path.join(__dirname, 'resources', 'IconPressed.png'));

	var nodev_template = [
		{label: locale[lang].menu.about,click: function(){electron.newAbout();}},
		{type: 'separator'},
		{label: locale[lang].menu.help,click: function(){open('http://lumios.xyz/support.html');}},
		{label: locale[lang].menu.settings,click: function(){electron.newSettings();}},
		{type: 'separator'},
		{label: locale[lang].menu.contribute,click: function(){open('https://github.com/lumios/eew');}},
		{label: locale[lang].menu.bug,click: function(){open('https://github.com/lumios/eew/issues');}},
		//{label: locale[lang].menu.updates,click: function(){}},
		{type: 'separator'},
		{label: locale[lang].menu.quit,click: function(){logger.debug('Closed via Tray Menu');process.exit(0);}}
	];

	var dev_template = [
		{label: locale[lang].menu.about,click: function(){electron.newAbout();}},
		{type: 'separator'},
		{label: locale[lang].menu.help,click: function(){open('http://lumios.xyz/support.html');}},
		{label: locale[lang].menu.settings,click: function(){electron.newSettings();}},
		{type: 'separator'},
		{label: locale[lang].menu.contribute,click: function(){open('https://github.com/lumios/eew');}},
		{label: locale[lang].menu.bug,click: function(){open('https://github.com/lumios/eew/issues');}},
		//{label: locale[lang].menu.updates,click: function(){}},
		{type: 'separator'},
		{label: locale[lang].menu.devtools, submenu:[
			{label: locale[lang].menu.test,click: function(){quake.parse(trigger.quake());}},
		]},
		{type: 'separator'},
		{label: locale[lang].menu.quit,click: function(){logger.debug('Closed via Tray Menu');process.exit(0);}}
	];

	if (settings.dev_mode) contextMenu = electron.Menu.buildFromTemplate(dev_template);
	else contextMenu = electron.Menu.buildFromTemplate(nodev_template);

	appTray.setToolTip('Shake');
	appTray.setContextMenu(contextMenu);
});

electron.app.on('window-all-closed', function() {
	if (process.platform == 'darwin') electron.app.dock.hide();
	return;
});

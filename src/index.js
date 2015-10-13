var socket = require('socket.io-client')('http://eew.kurisubrooks.com:3080');
var tools = require('lumios-toolkit'); // Lumios Proprietary Tools
var osenv = require('osenv'); // OS Specific Globals
var open = require('open'); // Opens URLs in Web Browsers
var fse = require('fs-extra'); // File System Extras
var path = require('path'); // File System Paths
var fs = require('fs'); // File System

var BrowserWindow = require('browser-window'); // Electron Window Manager
var app = require('app'); // Electron GUI
var Menu = require('menu'); // Electron Menu API
var Tray = require('tray'); // Electron Tray API
var ipc = require('ipc'); // Electron inter-process comm
require('crash-reporter').start(); // Electron Crash Reporter

var settings, notifier, settingsPath, settingsFile;
if (process.platform === 'darwin') notifier = require(path.join(__dirname, '../lib', 'node-notifier'));
else notifier = require('node-notifier');

settingsPath = path.join(__dirname, 'settings.json');
settingsFile = {"lang": "en", "min_alert": "35", "first_run": true, "night_mode": true, "dev_mode": true};

if (!fs.existsSync(settingsPath)) {
	tools.warn('Settings File does not exist, using tempoary file...');
	tools.warn('Generating new settings file');
	settings = settingsFile;

	fs.writeFile(settingsPath, JSON.stringify(settingsFile), function(error) {
		if (error) tools.error('Could not generate file: ' + error);
	}, tools.success('Settings File generated.'));
} else {
	settings = require('./settings.json');
	tools.success('Loaded Settings.');
}

var parser = require('./parser.js'); // Quake Data Parsing
var trigger = require('./trigger.js'); // Quake Testing Trigger
var lang = settings.lang; // Import Language Settings
var date = new Date(); // Gets Date/Time
var locale = JSON.parse(fs.readFileSync(path.join(__dirname, 'resources', 'lang.json')) + '');
var copy = path.join(__dirname, 'resources', 'audio');
var paste = osenv.home() + '/Library/Sounds/';
var alertWindows = {};
var alertRevision = {};
var appIcon = null;
var electronReady = false;

function newWindow(data) {
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
	alertWindow.loadUrl('file://' + __dirname + '/index.html');
}

function newSettings() {
	var settingsWindow = new BrowserWindow({
		'title': 'Settings',
		'icon': path.join(__dirname, 'resources', 'icon.png'),
		'width': 500,
		'height': 550,
		'resizable': false,
		'auto-hide-menu-bar': true,
		'skip-taskbar': false
	});

	if (process.platform == 'darwin') app.dock.show();
	settingsWindow.loadUrl('file://' + __dirname + '/settings.html');
}

if (process.platform === 'darwin') {
	fse.copy(copy, paste, function(error) {
		tools.success('Installed Sounds to [' + paste + ']');
		if (error) tools.error('Error: ' + error);
	});
}

socket.on('connect', function() {
	tools.success('Connected to Server.');

	if (process.platform == 'darwin') notifier.notify({
		'title': locale[lang].title,
		'message': locale[lang].connect,
		'sound': false
	});

	else notifier.notify({
		'title': locale[lang].title,
		'message': locale[lang].connect,
		'sound': false,
		'icon': path.join(__dirname, 'resources', 'icon.png')
	});
});

socket.on('data', function(data) {
	tools.debug('New Data from Server, Triggering Quake...');
	parse(data);
});

socket.on('disconnect', function() {
	tools.error('Socket Dropped, Trying to reconnect...');

	if (process.platform == 'darwin') notifier.notify({
		'title': locale[lang].title,
		'message': locale[lang].disconnect,
		'sound': false
	});

	else notifier.notify({
		'title': locale[lang].title,
		'message': locale[lang].disconnect,
		'sound': false,
		'icon': path.join(__dirname, 'resources', 'icon.png')
	});
});

function parse(input) {
	var data = JSON.parse(input);

	try {
		var sound_string = parser.soundString(data);
		var situation_string = parser.situationString(data, locale);
		var template = parser.template(data, locale);
		var subtitle_template = template[0];
		var message_template = template[1];

		if (data.drill) tools.debug('Test Quake triggered by user');
		tools.info(data.earthquake_time + ' - ' + data.epicenter_en);
		tools.info(locale.en.units.update + ' ' + situation_string + ', ' + locale.en.units.magnitude + ': ' + data.magnitude + ', ' + locale.en.units.seismic + ': ' + data.seismic_en);

		// Night Mode Check
		if (date.getHours() >= '07' || data.magnitude >= 6) {
			// Mac Day Notification
			if (process.platform === 'darwin') {
				notifier.notify({
					'title': locale[lang].title,
					'subtitle': subtitle_template,
					'message': message_template,
					'sound': sound_string,
					'time': 10000,
					'wait': true
				});
			// Linux & Windows Day Notification
			} else {
				notifier.notify({
					'title': locale[lang].title,
					'subtitle': subtitle_template,
					'message': message_template,
					'icon': path.join(__dirname, 'resources', 'icon.png'),
					'sound': sound_string,
					'urgency': 'critical',
					'time': 10000
				});
			}
		} else {
			tools.debug('Night Mode Enabled, Triggering silent quake...');

			// Mac Night Notifiction
			if (process.platform === 'darwin') {
				notifier.notify({
					'title': locale[lang].title,
					'subtitle': subtitle_template,
					'message': message_template,
					'sound': false,
					'time': 10000,
					'wait': true
				});
			// Linux & Windows Night Notification
			} else {
				notifier.notify({
					'title': locale[lang].title,
					'subtitle': subtitle_template,
					'message': message_template,
					'icon': path.join(__dirname, 'resources', 'icon.png'),
					'sound': false,
					'urgency': 'critical',
					'time': 10000
				});
			}
		}

		if (data.revision == 1 && (alertRevision[data.earthquake_id] === undefined || data.revision > alertRevision[data.earthquake_id]) && electronReady === true) {
			newWindow(data);
			var alertWindow = alertWindows[data.earthquake_id];
			var webContent = alertWindow.webContents;
			webContent.on('did-finish-load', function() {
				webContent.send('data', [data, template, locale]);
			});

			alertWindow.on('closed', function() {
				alertWindow = null;
			});
		} else if (electronReady === true) {
			if (alertWindows[data.earthquake_id] === undefined) {
				newWindow(data);
				var webContent2 = alertWindows[data.earthquake_id].webContents;
				webContent2.on('did-finish-load', function() {
					webContent2.send('data', [data, template, locale]);
				});

			} else if (alertRevision[data.earthquake_id] !== undefined && data.revision > alertRevision[data.earthquake_id]) {
				var webContents = alertWindows[data.earthquake_id].webContents;
				webContents.send('data', [data, template, locale]);
				alertRevision[data.earthquake_id] = data.revision;
			}
		}

	} catch (error) {
		if (process.platform == 'darwin') notifier.notify({
			'title': locale[lang].title,
			'message': locale[lang].error + ': ' + error.message,
			'sound': false
		});

		else notifier.notify({
			'title': locale[lang].title,
			'message': locale[lang].error + ': ' + error.message,
			'sound': false,
			'icon': path.join(__dirname, 'resources', 'icon.png')
		});

		tools.error('Error: ' + error);
	}
}

if (process.platform == 'darwin') app.dock.hide();

app.on('ready', function() {
	electronReady = true;

	if (settings.first_run) {
		newSettings();
		tools.debug('First run, opening settings window...');
	}

	appIcon = new Tray(path.join(__dirname, 'resources', 'IconTemplate.png'));
	appIcon.setPressedImage(path.join(__dirname, 'resources', 'IconPressed.png'));

	var nodev_template = [
		{label: locale[lang].contribute,click: function(){open('https://github.com/lumios/eew');}},
		{label: locale[lang].bug,click: function(){open('https://github.com/lumios/eew/issues');}},
		{type: 'separator'},
		{label: locale[lang].settings,click: function(){newSettings();}},
		{label: locale[lang].help,click: function(){open('http://lumios.xyz/support.html');}},
		{label: locale[lang].quit,click: function(){tools.debug('Closing Program due to User Request');process.exit(0);}}
	];

	var dev_template = [
		{label: locale[lang].devtools, submenu:[
			{label: locale[lang].test,click: function(){parse(trigger.quake());}},
		]},
		{type: 'separator'},
		{label: locale[lang].contribute,click: function(){open('https://github.com/lumios/eew');}},
		{label: locale[lang].bug,click: function(){open('https://github.com/lumios/eew/issues');}},
		{type: 'separator'},
		{label: locale[lang].settings,click: function(){newSettings();}},
		{label: locale[lang].help,click: function(){open('http://lumios.xyz/support.html');}},
		{label: locale[lang].quit,click: function(){tools.debug('Closing Program due to User Request');process.exit(0);}}
	];

	var contextMenu;
	if (settings.dev_mode) contextMenu = Menu.buildFromTemplate(dev_template);
	else contextMenu = Menu.buildFromTemplate(nodev_template);

	appIcon.setToolTip('EEW');
	appIcon.setContextMenu(contextMenu);

	appIcon.on('clicked', function(event) {
		tools.debuf(event);
	});

});

app.on('window-all-closed', function() {
	if (process.platform == 'darwin') app.dock.hide();
	return;
});

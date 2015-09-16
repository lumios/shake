var socket = require('socket.io-client')('http://ssh.kurisubrooks.com:3080');
var parser = require('./parser.js');           	// Code to parse EEW data
var colors = require('colors');                	// Terminal Text Formatting
var fse = require('fs-extra');                 	// File System Extras
var osenv = require('osenv');                  	// OS Specific Globals
var path = require('path');                    	// File System Paths
var fs = require('fs');				          	// File System

var BrowserWindow = require('browser-window'); 	// Electron Browser Windows
var app = require('app');                      	// Electron GUI
var Menu = require('menu');					   	// Electron Menu API
var Tray = require('tray');						// Electron Tray API
var ipc = require('ipc');                      	// Electron inter-process comm
require('crash-reporter').start(); 			   	// Electron Crash Reporter

if (process.platform === 'darwin') var notifier = require('./lib/node-notifier');
else var notifier = require('node-notifier');

var date = new Date();
var lang = 'en';
var locale = JSON.parse(fs.readFileSync('./resources/lang.json') + '');
var copy = './resources/audio/';
var paste = osenv.home() + '/Library/Sounds/';
var alertWindows = {};
var alertRevision = {};
var appIcon = null;
var electronReady = false;

function newWindow(data) {
    var alertWindow = new BrowserWindow({
        'title': 'Earthquake Early Warning',
        'icon': __dirname + '/resources/icon.png',
        'width': 600,
        'height': 625,
        'resizable': false,
        'skip-taskbar': true
    });

    alertWindows[data.earthquake_id] = alertWindow;
    alertRevision[data.earthquake_id] = data.revision;

    if (process.platform == 'darwin') app.dock.show();

    alertWindow.loadUrl('file://' + __dirname + '/index.html');
}

colors.setTheme({tweet: 'cyan', success: 'green', error: ['red', 'bold'], warn: 'yellow', info: 'blue'});

if (process.platform === 'darwin') {
    fse.copy(copy, paste, function(error) {
        console.log(("[*] Installed Audio Files to " + paste).success);
        if (error) throw console.error(error.error);
    });
}

socket.on('connect', function() {
    console.log(('[*] Connected to Server').success);

	notifier.notify({
		'title': locale.en.title,
		'message': locale.en.connect,
		'sound': false
	});
});

socket.on('data', function(data) {
    console.log(('[>] Received New Data from Server').info);
    parse(data);
});

socket.on('disconnect', function() {
    console.log(('[!] Socket Dropped').error);

	notifier.notify({
		'title': locale.en.title,
		'message': locale.en.disconnect,
		'sound': false
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

        console.log(('[~] ' + data.earthquake_time + ' - ' + data.epicenter_en).yellow);
        console.log(('[~] ' + locale.en.units.update + ' ' + situation_string + ', ' + locale.en.units.magnitude + ': ' + data.magnitude + ', ' + locale.en.units.seismic + ': ' + data.seismic_en).yellow);

		// Night Mode Check
		if (date.getHours() >= '06' || scale.indexOf(data.seismic_en) >= 5) {
			// Mac Day Notification
			if (process.platform === 'darwin') {
	            notifier.notify({
	                'title': locale.en.title,
	                'subtitle': subtitle_template,
	                'message': message_template,
	                'sound': sound_string,
					'time': 10000,
					'wait': true
	            });
			// Linux & Windows Day Notification
	        } else {
	            notifier.notify({
	                'title': locale.en.title,
	                'subtitle': subtitle_template,
	                'message': message_template,
					'icon': path.join(__dirname, './resources/icon.png'),
	                'sound': sound_string,
	                'urgency': 'critical',
	                'time': 10000
	            });
	        }
		} else {
			// Mac Night Notifiction
			if (process.platform === 'darwin') {
	            notifier.notify({
	                'title': locale.en.title,
	                'subtitle': subtitle_template,
	                'message': message_template,
	                'sound': false,
					'time': 10000,
					'wait': true
	            });
			// Linux & Windows Night Notification
	        } else {
	            notifier.notify({
	                'title': locale.en.title,
	                'subtitle': subtitle_template,
	                'message': message_template,
					'icon': path.join(__dirname, './resources/icon.png'),
	                'sound': false,
	                'urgency': 'critical',
	                'time': 10000
	            });
			}
		}

        if (data.revision == 1 && (alertRevision[data.earthquake_id] == undefined || data.revision > alertRevision[data.earthquake_id]) && electronReady === true) {
            newWindow(data);
            var webContents = alertWindows[data.earthquake_id].webContents;
            webContents.on('did-finish-load', function() {
                webContents.send('data', [data, template, locale]);
            });

            var alertWindow = alertWindows[data.earthquake_id]
            
            alertWindow.on('closed', function() {
                alertWindow = null;
            });
        } else if(electronReady === true) {
            if(alertWindows[data.earthquake_id] === undefined) {
                newWindow(data);

                var webContents = alertWindows[data.earthquake_id].webContents;

                webContents.on('did-finish-load', function() {
                    webContents.send('data', [data, template, locale]);
                });
            } else if(alertRevision[data.earthquake_id] != undefined && data.revision > alertRevision[data.earthquake_id]) {
                alertWindow = alertWindows[data.earthquake_id];
                var webContents = alertWindow.webContents;
                webContents.send('data', [data, template, locale]);
                alertRevision[data.earthquake_id] = data.revision;
            }
        }

    } catch (err) {
        notifier.notify({'title': locale.en.title, 'message': locale.en.error + ': ' + err.message, 'sound': false});
    }
}

if (process.platform == 'darwin') app.dock.hide();

app.on('ready', function() {
    electronReady = true;

	appIcon = new Tray('./resources/dock16.png');
	var contextMenu = Menu.buildFromTemplate([
	  { label: 'Item1', type: 'radio' },
	  { label: 'Item2', type: 'radio' },
	  { label: 'Item3', type: 'radio', checked: true },
	  { label: 'Item4', type: 'radio' }
	]);
	appIcon.setToolTip('EEW');
	appIcon.setContextMenu(contextMenu);
});


app.on('window-all-closed', function() {
    if (process.platform == 'darwin') app.dock.hide();
	return;
});

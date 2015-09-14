var socket = require('socket.io-client')('http://ssh.kurisubrooks.com:3080');
var colors = require('colors');     // Terminal Text Formatting
var osenv = require('osenv');       // OS Specific Globals
var path = require('path');         // File System Paths
var fse = require('fs-extra');      // File System Extras
var fs = require('fs');				// File System

if (process.platform === 'darwin') var notifier = require('./lib/node-notifier');
else var notifier = require('node-notifier');

var date = new Date();
var lang = 'en';
var local = JSON.parse(fs.readFileSync('./resources/lang.json') + '');
var copy = './resources/audio/';
var paste = osenv.home() + '/Library/Sounds/';

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
		'title': local.en.title,
		'message': local.en.connect,
		'sound': false
	});
});

socket.on('data', function(data) {
    console.log(('[>] Data Received from Server').info);
    parse(data);
});

socket.on('disconnect', function() {
    console.log(('[!] Socket Dropped').error);

	notifier.notify({
		'title': local.en.title,
		'message': local.en.disconnect,
		'sound': false
	});
});

function parse(input) {
    var data = JSON.parse(input);

    try {
        //            0    1    2    3    4     5     6     7     8
        var scale = ['1', '2', '3', '4', '5-', '5+', '6-', '6+', '7'];
        if (data.revision == 1)							var sound_string = 'nhk-alert';
        else if (data.type == 2 || data.situation == 1)	var sound_string = 'simple';
        else if (scale.indexOf(data.seismic_en) >= 4)	var sound_string = 'keitai';
        else 											var sound_string = 'nhk';

        if (data.situation == 1)    var situation_string = local.en.units.final;
        else                        var situation_string = '#' + data.revision;

        if (data.type == 1 || data.situation == 2) {
            var subtitle_template 	= '';
            var message_template 	= local.en.cancelled;
        } else {
            var subtitle_template 	= data.epicenter_en;
            var message_template 	= local.en.units.magnitude + ': ' + data.magnitude + ', ' + local.en.units.seismic + ': ' + data.seismic_en;}

        console.log(('[~] ' + data.earthquake_time + ' - ' + data.epicenter_en).yellow);
        console.log(('[~] ' + local.en.units.update + ' ' + situation_string + ', ' + local.en.units.magnitude + ': ' + data.magnitude + ', ' + local.en.units.seismic + ': ' + data.seismic_en).yellow);

		// Night Mode Check
		if (date.getHours() >= '06' || scale.indexOf(data.seismic_en) >= 4) {
			if (process.platform === 'darwin') {
	            notifier.notify({
	                'title': local.en.title,
	                'subtitle': subtitle_template,
	                'message': message_template,
	                'sound': sound_string,
					'time': 10000,
					'wait': true
	            });
	        } else {
	            notifier.notify({
	                'title': local.en.title,
	                'subtitle': subtitle_template,
	                'message': message_template,
					'icon': path.join(__dirname, './resources/icon.png'),
	                'sound': sound_string,
	                'urgency': 'critical',
	                'time': 10000
	            });
	        }
		} else {
			if (process.platform === 'darwin') {
	            notifier.notify({
	                'title': local.en.title,
	                'subtitle': subtitle_template,
	                'message': message_template,
	                'sound': false,
					'time': 10000,
					'wait': true
	            });
	        } else {
	            notifier.notify({
	                'title': local.en.title,
	                'subtitle': subtitle_template,
	                'message': message_template,
					'icon': path.join(__dirname, './resources/icon.png'),
	                'sound': false,
	                'urgency': 'critical',
	                'time': 10000
	            });
			}
		}
    } catch (err) {
        notifier.notify({'title': 'Earthquake Early Warning', 'message': local.en.error + ': ' + err.message, 'sound': false});
    }
}

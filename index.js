var socket = require('socket.io-client')('http://ssh.kurisubrooks.com:3080');
var colors = require('colors');     // Terminal Text Formatting
var osenv = require('osenv');       // OS Specific Globals
var path = require('path');         // File System Paths
var fse = require('fs-extra');      // File System Extras

if (process.platform === 'darwin') var notifier = require('./lib/node-notifier');
else var notifier = require('node-notifier');

var lang = 'en';
var copyFiles = './resources/audio/';
var pasteFiles = osenv.home() + '/Library/Sounds/';

notifier.notify({'title': 'Earthquake Early Warning', 'message': 'EEW has started.', 'sound': false});
colors.setTheme({tweet: 'cyan', success: 'green', error: ['red', 'bold'], warn: 'yellow', info: 'blue'});

if (process.platform === 'darwin') {
    fse.copy(copyFiles, pasteFiles, function(error) {
        console.log("[*] Installed Audio Files to ".success + pasteFiles.success);
        if (error) throw console.error(error.error);
    });
}

socket.on('connect', function() {
    console.log(('[*] Connected to Server').success);
});

socket.on('data', function(data) {
    console.log(('[>]' + data).info);
    newQuake(data);
});

socket.on('disconnect', function() {
    console.log(('[!] Socket Dropped').error);
});

function newQuake(input) {
    var data = JSON.parse(input);

    try {
        switch (lang) {
            case 'en':
                var title_string = 'Earthquake Early Warning';
                var epicenter_string = 'Epicenter';
                var magnitude_string = 'Magnitude';
                var seismic_string = 'Max Seismic';
                var cancelled_string = 'This Earthquake Warning has been cancelled.'
                var epicenter_locale = data.epicenter_en;
                break;
            case 'jp':
                var title_string = '緊急地震速報（強い揺れに警戒して下さい）';
                var epicenter_string = '震源';
                var magnitude_string = 'マグニチュド';
                var seismic_string = '最大震度';
                var cancelled_string = '先ほどの地震速報は誤報です。';
                var epicenter_locale = data.epicenter_jp;
                break;
            default:
                var title_string = 'errnolang';
                var subtitle_string = 'errnolang';
                var epicenter_string = 'errnolang';
                var magnitude_string = 'errnolang';
                var seismic_string = 'errnolang';
                var cancelled_string = 'errnolang';
                var epicenter_locale = data.epicenter_jp;
                break;
        }

        //            0    1    2    3    4     5     6     7     8
        var scale = ['1', '2', '3', '4', '5-', '5+', '6-', '6+', '7'];
        if      (data.revision == 1)                            var sound_string = 'nhk-alert';
        else if (data.type == 39 || data.situation == 7)        var sound_string = 'simple';
        else if (scale.indexOf(data.seismic) >= 4)              var sound_string = 'keitai';
        else                                                    var sound_string = 'nhk';

        if (data.situation == 1)    var situation_string = 'Final';
        else                        var situation_string = '#' + data.revision;

        if (data.seismic == '不明')       var seismic_locale = 'Unknown';
        else                             var seismic_locale = data.seismic;

        if (data.type == 1 || data.situation == 2) {
            var subtitle_template = '';
            var message_template = cancelled_string;
        } else {
            var subtitle_template = epicenter_locale;
            var message_template = magnitude_string + ': ' + data.magnitude + ', ' + seismic_string + ': ' + seismic_locale;}

        console.log(('[~] ' + data.earthquake_time + ' - ' + epicenter_locale).yellow);
        console.log(('[~] Update ' + situation_string + ', Magnitude: ' + data.magnitude + ', Seismic: ' + seismic_locale).yellow);

        if (process.platform === 'darwin') {
            notifier.notify({
                'title': title_string,
                'subtitle': subtitle_template,
                'message': message_template,
                'sound': sound_string
            });
        }

        else if (process.platform === 'linux') {
            notifier.notify({
                'title': title_string,
                'subtitle': subtitle_template,
                'message': message_template,
                'sound': sound_string,
                'urgency': 'critical',
                'time': 10000
            });
        }

        else {
            notifier.notify({
                'title': title_string,
                'message': subtitle_template + '\n' + message_template,
                'icon': path.join(__dirname, './resources/icon.png'),
                'time': 5000,
                'wait': true
            });
        }
    } catch (err) {
        notifier.notify({'title': 'Earthquake Early Warning', 'message': 'Error: ' + err.message, 'sound': false});
    }
}

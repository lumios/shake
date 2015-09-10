var twitter = require('twitter');   // Twitter
var request = require('request');   // Twitter Get Bearer Token
var moment = require('moment');     // Formatted Date & Time
var colors = require('colors');     // Terminal Text Formatting
var osenv = require('osenv');       // OS Specific Globals
var path = require('path');         // File System Paths
var fse = require('fs-extra');      // File System Extras

var remote = require('remote');
var BrowserWindow = remote.require('browser-window');

require('crash-reporter').start();

if (process.platform === 'darwin') var notifier = require('../lib/node-notifier');
else var notifier = require('node-notifier');

var keys = require('./keys.js');
var trans = require('./resources/epicenter.json');

var lang = 'en';
var copyFiles = './resources/audio/';
var pasteFiles = osenv.home() + '/Library/Sounds/';
var twitID1 = '3313238022'; //test
var twitID2 = '214358709'; //eew

function getDateTime() {return moment().utcOffset(600).format('DD/MM/YY h:mm:ss');}
colors.setTheme({tweet: 'cyan', success: 'green', error: ['red', 'bold'], warn: 'yellow', info: 'blue'});

if (process.platform === 'darwin') {
    fse.copy(copyFiles, pasteFiles, function(error) {
        console.log("[*] Installed Audio Files to ".success + pasteFiles.success);
        if (error) throw console.error(error.error);
    });
}

var enc_secret = new Buffer(keys.twit_conkey + ':' + keys.twit_consec).toString('base64');
var oauthOptions = {url: 'https://api.twitter.com/oauth2/token',headers: {'Authorization': 'Basic ' + enc_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},body: 'grant_type=client_credentials'};

var client = new twitter({
    consumer_key: keys.twit_conkey,
    consumer_secret: keys.twit_consec,
    //bearer_token: request.post(oauthOptions, function(e, r, body) {JSON.parse(body).access_token})
    access_token_key: keys.twit_acckey,
    access_token_secret: keys.twit_accsec
});

notifier.notify({
    'title': 'Earthquake Early Warning',
    'message': 'EEW has started.',
    'sound': false
});


    client.stream('statuses/filter', {follow: twitID1}, function(stream) {
        console.log('[*] Connecting to Twitter..'.success);
        stream.on('data', function(tweet) {
            if (tweet.delete != undefined) return;
            if (tweet.user.id_str == twitID1) {
                console.log(('[>] ' + tweet.text).tweet);
                newQuake(tweet.text);
            }
        });

        stream.on('error', function(error) {
            notifier.notify({'title': 'Earthquake Early Warning','message': 'Crashed: ' + error.source,'sound': 'Ping'});
            console.error(('[!] ERROR - ' + error.source).error);
        });
    });

    function newQuake(inputData) {
        var parsedInput = inputData.split(',');

        var i, item, j, len, ref;
        ref = ['type', 'training_mode', 'announce_time', 'situation', 'revision', 'earthquake_id', 'earthquake_time', 'latitude', 'longitude', 'epicenter', 'depth', 'magnitude', 'seismic', 'geography', 'alarm'];

        for (i = j = 0, len = ref.length; j < len; i = ++j) {
            item = ref[i];
            global[item] = parsedInput[i];
        }

        var translationNotFound = true;
        for (var i = 0; i < trans.length; i++) {
            var item = trans[i];

            if (item.jp == epicenter) {
                translationNotFound = false;
                var epicenterJP = item.jp;
                var epicenterEN = item.en;
            }
        }

        if (translationNotFound) {
            var epicenterJP = epicenter;
            var epicenterEN = epicenter;
        }

        switch (lang) {
            case 'en':
                var titleString = 'Earthquake Early Warning';
                var subtitleString = 'Earthquake occurred';
                var epicenterString = 'Epicenter';
                var magnitudeString = 'Magnitude';
                var seismicString = 'Max Seismic';
                var cancelledString = 'This Earthquake Warning has been cancelled.'
                var epicenterLocale = epicenterEN;
                break;
            case 'jp':
                var titleString = '緊急地震速報（強い揺れに警戒して下さい）';
                var subtitleString = 'Earthquake occurred';
                var epicenterString = '震源';
                var magnitudeString = 'マグニチュド';
                var seismicString = '最大震度';
                var cancelledString = '先ほどの地震速報は誤報です。';
                var epicenterLocale = epicenterJP;
                break;
            default:
                var titleString = 'errnolang';
                var subtitleString = 'errnolang';
                var epicenterString = 'errnolang';
                var magnitudeString = 'errnolang';
                var seismicString = 'errnolang';
                var cancelledString = 'errnolang';
                var epicenterLocale = epicenterJP;
                break;
        }
        //            0    1    2    3    4      5     6     7     8      9     10     11    12
        var scale = ['1', '2', '3', '4', '5弱', '5-', '5強', '5+', '6弱', '6-', '6強', '6+', '7'];
        if      (revision == 1)                        var soundString = 'nhk-alert';
        else if (type == 39 || situation == 7)         var soundString = 'simple';
        else if (scale.indexOf(seismic) >= 4)          var soundString = 'keitai';
        else                                           var soundString = 'nhk';

        if (situation == 9) var situationString = 'Final';
        else                var situationString = '#' + revision;

        if (seismic == '不明')      var seismicLocale = 'Unknown';
        else                        var seismicLocale = seismic;

        if (type == 39 || situation == 7) {
            var subtitleTemplate = '';
            var messageTemplate = cancelledString;
        } else {
            var subtitleTemplate = epicenterLocale;
            var messageTemplate = magnitudeString + ': ' + magnitude + ', ' + seismicString + ': ' + seismicLocale;}

        console.log(('[~] ' + earthquake_time + ' - ' + epicenterLocale).yellow);
        console.log(('[~] Update ' + situationString + ', Magnitude: ' + magnitude + ', Seismic: ' + seismicLocale).yellow);

        if (revision == '1') {
            var win = null;

            win = new BrowserWindow({
                'title': 'Earthquake Alert',
                'icon': __dirname + '/resources/icon.png',
                'width': 700,
                'height': 500,
                'resizable': false,
                //'always-on-top': true,
                'fullscreen': false,
                'skip-taskbar': true
            });

            win.loadUrl('file://' + __dirname + '/index.html');
            //win.openDevTools();

            win.show();
            console.log("Opening Window");

            win.on('closed', function() {
                win = null;
            });
        }

        if (process.platform === 'linux' || process.platform === 'darwin') {
            notifier.notify({
                'title': titleString,
                'subtitle': subtitleTemplate,
                'message': messageTemplate,
                'sound': soundString
            });
        }

        else if (process.platform == 'win32') {
            notifier.notify({
                'title': titleString,
                'message': subtitleTemplate + '\n' + messageTemplate,
                'icon': path.join(__dirname, './resources/icon.png')
            });
        }

        else {
            notifier.notify({
                'title': titleString,
                'message': subtitleTemplate + '\n' + messageTemplate,
                'icon': path.join(__dirname, './resources/icon.png')
            });
        }
    }

function electron() {

}

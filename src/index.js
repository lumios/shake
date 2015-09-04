var notifier = require('../lib/node-notifier');

var twitter = require('twitter');
var moment = require('moment');
var path = require('path');
var os = require('os');

var keys = require('./keys.js');
var trans = require('./resources/epicenter.json');

function getDateTime() {return moment().utcOffset(600).format('DD/MM/YY h:mm:ss')}

var lang = 'en';
var twitID1 = '3313238022'; //testbot
var twitID2 = '214358709'; //eew

var client = new twitter({
    consumer_key: keys.twit_conkey,
    consumer_secret: keys.twit_consec,
    access_token_key: keys.twit_acckey,
    access_token_secret: keys.twit_accsec
});

notifier.notify({
    'title': 'Earthquake Early Warning',
    'message': 'Connected to Twitter.',
    'sound': false
});

client.stream('statuses/filter', {follow: twitID1}, function(stream) {
    console.log('Connected to ' + twitID1);
    stream.on('data', function(tweet) {
        if (tweet.delete != undefined) return;
        if (tweet.user.id_str == twitID1) {
            console.log(tweet.text);
            newQuake(tweet.text);
        }
    });

    stream.on('error', function(error) {throw error;});
    stream.on('end', function(response) {console.log(response);});
});

client.stream('statuses/filter', {follow: twitID2}, function(stream) {
    console.log('Connected to ' + twitID2);
    stream.on('data', function(tweet) {
        if (tweet.delete != undefined) return;
        if (tweet.user.id_str == twitID2) {
            console.log(tweet.text);
            newQuake(tweet.text);
        }
    });

    stream.on('error', function(error) {throw error;});
    stream.on('end', function(response) {console.log(response);});
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
            var magnitudeString = 'Magnitude';
            var seismicString = 'Max Seismic';
            var cancelledString = 'This Earthquake Warning has been cancelled.'
            var epicenterLocale = epicenterEN;
            break;
        case 'jp':
            var titleString = '緊急地震速報（強い揺れに警戒して下さい）';
            var subtitleString = 'Earthquake occurred';
            var magnitudeString = 'マグニチュド';
            var seismicString = '最大震度';
            var cancelledString = '先ほどの地震速報は誤報です。';
            var epicenterLocale = epicenterJP;
            break;
        default:
            var titleString = 'error - no lang selected';
            var subtitleString = 'error - no lang selected';
            var magnitudeString = 'error';
            var seismicString = 'error';
            var cancelledString = 'error - no lang selected';
            var epicenterLocale = epicenterJP;
            break;
    }

    var scale = ['1', '2', '3', '4', '5弱', '5強', '6弱', '6強', '7'];
         if (scale.indexOf(seismic) >= 4)       var soundString = 'keitai';
    else if (type == 39 || situation == 7)      var soundString = 'simple';
    else if (magnitude < 5.2 && revision == 1)  var soundString = 'nhk-alert';
    else                                        var soundString = 'nhk';

    if (situation == 9) var situationString = 'Final';
    else                var situationString = '#' + revision;

    if (seismic == '不明')      var seismicLocale = 'Unknown';
    else                        var seismicLocale = seismic;

    if (type == 39 || situation == 7) {
        var subtitleTemplate = cancelledString;
        var messageTemplate = cancelledString;
    } else {
        var subtitleTemplate = epicenterLocale;
        var messageTemplate = magnitudeString + ': ' + magnitude + ', ' + seismicString + ': ' + seismicLocale;}

    console.log(earthquake_time + ' - ' + epicenterLocale);
    console.log('Update ' + situationString + ', Magnitude: ' + magnitude + ', Seismic: ' + seismicLocale);

    if (os.platform() === 'linux' || os.platform() === 'darwin') {
        notifier.notify({
            'title': titleString,
            'subtitle': subtitleTemplate,
            'message': messageTemplate,
            'sound': soundString
        });
    }

    else if (os.platform() == 'win32') {
        notifier.notify({
            'title': titleString,
            'message': subtitleTemplate + '\n' + messageTemplate,
            'icon': path.join(__dirname, 'resources/icon.png')
        });
    }

    else {
        notifier.notify({
            'title': titleString,
            'message': subtitleTemplate + '\n' + messageTemplate,
            'icon': path.join(__dirname, 'resources/icon.png')
        });
    }
}

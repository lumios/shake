var notifier = require('node-notifier');
var twitter = require('twitter');
var moment = require("moment");
var parse = require('csv-parse');
var path = require('path');

function getDateTime() {return moment().utcOffset(600).format("DD/MM/YY h:mm:ss");}

var client = new twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

var userID = '3313238022'; // LighterBot1
//var userID = '1875425748'; // kurisubrooks
//var userID = '214358709'; // eewbot
client.stream('statuses/filter', {follow: userID, filter_level: 'low'}, function(stream) {
    console.log('Connected.');

    stream.on('data', function(tweet) {
        if (tweet.delete != undefined) {
            return;
        }

        if (tweet.user.id_str == userID) {
            console.log(getDateTime());
            console.log("\"" + tweet.text + "\"");
            dataParse(tweet.text);
        }
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});

function dataParse(inputData) {
    var headers = 'type,training_mode,announce_time,situation,revision,earthquake_id,earthquake_time,latitude,longitude,epicenter,depth,magnitude,semismic,geography,alarm';
    var input = inputData;

    parse(input, function(err, output){
        console.log(output);
    });
}

function newQuake(quake) {
    var lang = 'jp';
    switch (lang) {
        case 'en':
            var titleString = 'Earthquake Early Warning';
            var subtitleString = 'Please be alert to strong shaking.';
            var magnitudeString = 'Magnitude';
            var seismicString = 'Max Seismic';
            var tsunamiFalseString = 'No Tsunami Threat';
            var tsunamiTrueString = 'Tsunami Warning';
            break;
        case 'jp':
            var titleString = '緊急地震速報';
            var subtitleString = '緊急地震速報です。強い揺れに警戒して下さい。';
            var magnitudeString = 'マグニチュド';
            var seismicString = '最大震度';
            var tsunamiFalseString = '津波の心配はありません';
            var tsunamiTrueString = '津波警報が発令されました';
            break;
        default:
            var titleString, subtitleString, magnitudeString, seismicString, tsunamiFalseString, tsunamiTrueString = 'error - no lang selected';
            break;
    }

    notifier.notify({
        'title': titleString,
        'subtitle': subtitleString,
        'message': quake,
        'sound': 'nhk',
        'icon': path.join(__dirname, 'icon.png')
    }, function(error, response) {
        console.log(response);
    });
}

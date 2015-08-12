var notifier = require('node-notifier');
var twitter = require('twitter');
var moment = require("moment");
var path = require('path');

function getDateTime() {return moment().utcOffset(600).format("DD/MM/YY h:mm:ss");}

var client = new twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

//var userID = '3313238022'; // LighterBot1
//var userID = '1875425748'; // kurisubrooks
var userID = '214358709'; // eewbot
client.stream('statuses/filter', {follow: userID, filter_level: 'low'}, function(stream) {
    console.log('Connected.');

    stream.on('data', function(tweet) {
        if (tweet.delete != undefined) {
            return;
        }

        if (tweet.user.id_str == userID) {
            console.log(getDateTime());
            dataParse(tweet.text);

            if (training_mode == 0) {
                newQuake(dataParse);
            }
        }
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});

function dataParse(inputData) {
    var parsedInput = inputData.split(',');

    var i, item, j, len, ref;
    ref = ["type", "training_mode", "announce_time", "situation", "revision", "earthquake_id", "earthquake_time", "latitude", "longitude", "epicenter", "depth", "magnitude", "seismic", "geography", "alarm"];

    for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        global[item] = parsedInput[i];
    }

         if(situation==0){var situationString = "Preliminary"}
    else if(situation==7){var situationString = "Cancelled"}
    else if(situation==8||9){var situationString = "Final"}

    console.log("Time: " + earthquake_time + ", Situation: " + situationString + ", Revision: " + revision);
    console.log("Epicenter: " + epicenter + " (" + latitude + "," + longitude + "), Magnitude: " + magnitude + ", Seismic: " + seismic);
}

function newQuake(quake) {
    var lang = 'en';
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

         if(revision==1){var soundString = "nhk-alert"}
    else if(revision!=1){var soundString = "nhk"}

    notifier.notify({
        'title': titleString,
        'subtitle': subtitleString,
        'message': magnitudeString + ": " + magnitude + ", " + seismicString + ": " + seismic,
        'sound': soundString,
        'icon': path.join(__dirname, 'icon.png')
    }, function(error, response) {
        console.log(response);
    });
}

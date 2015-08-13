var notifier = require('node-notifier');
var twitter = require('twitter');
var moment = require('moment');
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

         if(situation==0)   {var situationString = "Estimate"}
    else if(situation==7)   {var situationString = "Cancelled"}
    else if(situation==8||9){var situationString = "Final"}

    console.log("Time: " + earthquake_time + ", Situation: " + situationString + " (Update #" + revision + ")");
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
            break;
        case 'jp':
            var titleString = '緊急地震速報';
            var subtitleString = '緊急地震速報です。強い揺れに警戒して下さい。';
            var magnitudeString = 'マグニチュド';
            var seismicString = '最大震度';
            break;
        default:
            var titleString = 'error - no lang selected';
            var subtitleString = 'error - no lang selected';
            var magnitudeString = 'error';
            var seismicString = 'error';
            break;
    }

             if (magnitude > 5.2) {var soundString = "keitai";}
        else if (type == 39 || situation == 7) {var soundString = "simple";}
        else if (magnitude < 5.2 && revision == 1) {var soundString = "nhk-alert";}
        else if (magnitude < 5.2 && revision != 1) {var soundString = "nhk";}

        if (type == 39 || situation == 7) {
            var subtitleTemplate = "The Earthquake Warning has been cancelled."; var messageTemplate = "The Earthquake Warning has been cancelled.";
        } else {
            var subtitleTemplate = subtitleString;
            var messageTemplate = epicenter + ", " + magnitudeString + ": " + magnitude + ", " + seismicString + ": " + seismic;
        }

    notifier.notify({
        'title': titleString,
        'subtitle': subtitleString,
        'message': messageTemplate,
        'sound': soundString,
        'icon': path.join(__dirname, 'icon.png')
    }, function(error, response) {
        console.log(response);
    });
}

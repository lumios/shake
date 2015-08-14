var notifier = require('node-notifier');
var twitter = require('twitter');
var moment = require('moment');
var path = require('path');

// Getting date & time
function getDateTime(){return moment().utcOffset(600).format("DD/MM/YY h:mm:ss");}

// Twitter authentication key
var client = new twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

// Which User to Track
var userID = 214358709; // eewbot
//var userID = 3313238022; // LighterBot1
//var userID = 1875425748; // kurisubrooks

if(userID == 214358709){
    var userName = 'eewbot';}
else if(userID == 3313238022){
    var userName = 'lighterbot1';}
else {var userName = userID;}

// Twitter Stream
client.stream('statuses/filter', {follow: userID, filter_level: 'low'}, function(stream) {
    console.log('Connected to ' + userName);
    console.log('Monitor Started, Waiting for Earthquake.')

    stream.on('data', function(tweet) {
        // If tweet was deleted, ignore
        if (tweet.delete != undefined) {
            return;
        }

        // Twitter Receiver (if new quake)
        if (tweet.user.id_str == userID) {
            console.log(getDateTime() + " Earthquake Detected, Triggering Event:");

            // If Tweet, parse
            dataParse(tweet.text);

            // Push Quake if not a False Alarm
            if (training_mode == 0) {
                newQuake(dataParse);
            }
        }
    });

    // If error, post in console
    stream.on('error', function(error) {
        console.log(error);
    });
});

function dataParse(inputData) {
    // Parsing CSV to Array
    var parsedInput = inputData.split(',');

    // Assigning Values to Variables
    var i, item, j, len, ref;
    ref = ["type", "training_mode", "announce_time", "situation", "revision", "earthquake_id", "earthquake_time", "latitude", "longitude", "epicenter", "depth", "magnitude", "seismic", "geography", "alarm"];

    for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        global[item] = parsedInput[i];
    }

    if (situation == 9){var situationString = "Final";} else {var situationString = "#" + revision;}

    // Printing Quake Data to Console
    console.log("Time: " + earthquake_time + ", Update: " + situationString);
    console.log("Epicenter: " + epicenter + " (" + latitude + "," + longitude + "), Magnitude: " + magnitude + ", Seismic: " + seismic);
}

// Notification
function newQuake(quake) {
    // Language Strings
    var lang = 'en';
    switch (lang) {
        case 'en':
            var titleString = 'Earthquake Early Warning';
            var subtitleString = 'Please be alert to strong shaking.';
            var magnitudeString = 'Magnitude';
            var seismicString = 'Max Seismic';
            var cancelledString = 'This Earthquake Warning has been cancelled.'
            break;
        case 'jp':
            var titleString = '緊急地震速報';
            var subtitleString = '緊急地震速報です。強い揺れに警戒して下さい。';
            var magnitudeString = 'マグニチュド';
            var seismicString = '最大震度';
            var cancelledString = '先ほどの地震速報は誤報です。';
            break;
        default:
            var titleString = 'error - no lang selected';
            var subtitleString = 'error - no lang selected';
            var magnitudeString = 'error';
            var seismicString = 'error';
            var cancelledString = 'error - no lang selected';
            break;
    }

        // Assigning Alert Tones
        var seismicScale = ['1', '2', '3', '4', '5-', '5+', '6-', '6+', '7'];

        if (seismicScale.indexOf(seismic) >= 4) {
            var soundString = "keitai";}
        else if (type == 39 || situation == 7) {
            var soundString = "simple";}
        else if (magnitude < 5.2 && revision == 1) {
            var soundString = "nhk-alert";}
        else {
            var soundString = "nhk";}

        // Warning Cancellation
        if (type == 39 || situation == 7) {
            var subtitleTemplate = cancelledString;
            var messageTemplate = cancelledString;
        } else {
            var subtitleTemplate = subtitleString;
            var messageTemplate = epicenter + ", " + magnitudeString + ": " + magnitude + ", " + seismicString + ": " + seismic;
        }

    // Notification Push
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

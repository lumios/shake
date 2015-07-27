var request = require("request");
var notifier = require("node-notifier");
var parseString = require('xml2js').parseString;
var path = require("path");
var moment = require("moment");
var os = require('os');
var oldQuakes = [];
require("babel/polyfill");

function getDateTime() {return moment().utcOffset(600).format("DD/MM/YY h:mm:ss");}
console.log(getDateTime() + '  [#] Process Started, Checking for Quakes...');

function newQuake(quake) {
    if (quake.magnitude > 50) {var sound = 'reic';}
    if (quake.magnitude < 50) {var sound = 'nhk';}

    if (false && os.platform() === 'linux' || os.platform() === 'darwin') {
        notifier.notify({
            'title': 'Earthquake Early Warning',
            'subtitle': 'An Earthquake has occured in ' + quake.epicenter_code,
            'message': 'Magnitude: ' + quake.magnitude / 10 + ', Seismic Scale: ' + quake.seismic_scale,
            'sound': sound,
            'icon': path.join(__dirname, 'resources/icon2.png')
        });
    }

    else if (false && os.platform() == 'win32') {
        notifier.notify({
            'title': 'Earthquake Early Warning',
            'message': 'A Magnitude ' + quake.magnitude / 10 + ' Earthquake (Shindo' + quake.seismic_scale + ') is about to occur in ' + quake.epicenter_code + '. Please prepare for strong shaking.',
            'icon': path.join(__dirname, 'resources/icon2.png')
        });
    }

    console.log(getDateTime() + " [[*]] Received Earthquake Data");
    console.log(getDateTime() + "  [-] Time: " + moment(quake.eq_date, "X").fromNow());
    console.log(getDateTime() + "  [-] Area: " + quake.epicenter_code + " (" + quake.epicenter_lat + "," + quake.epicenter_lng + ")");
    console.log(getDateTime() + "  [-] Magnitude: " + quake.magnitude / 10 + "M");
    console.log(getDateTime() + "  [-] Seismic: " + quake.seismic_scale);

    /*
    console.log(getDateTime() + " [!] Earthquake Detected, Triggering Event");
    console.log(getDateTime() + " [-] Date/Time: " + moment(quake.eq_date, "X").fromNow());
    console.log(getDateTime() + " [-] Magnitude: " + quake.magnitude / 10 + "M");
    console.log(getDateTime() + " [-] Seismic: " + quake.seismic_scale);
    console.log(getDateTime() + " [-] Latitude: " + quake.epicenter_lat);
    console.log(getDateTime() + " [-] Longitude: " + quake.epicenter_lng);
    console.log(getDateTime() + " [-] Depth: " + quake.depth + "km");*/
}

function read(error, response, body) {
    if (error) {
        console.log(error);
    }

    parseString(body, function(err, result) {
        if (oldQuakes.length !== 0) {
            for (var quake of result.quakes.quake) {
                var notfound = true
                for (var oldQuake of oldQuakes) {
                    if (oldQuake.quake_id === quake.quake_id) {
                        notfound = false
                        break
                    }
                }
                if (notfound) {
                    newQuake(quake)
                    break
                }
            }
        }
        oldQuakes = result.quakes.quake;
    });
}

function search() {
    request('http://api.quake.twiple.jp/quake/index.xml', read);
}

setInterval(search, 2000);

/*
setInterval(function() {
    newQuake({
        "eq_date": "1438008000",
        "epicenter_code": "476",
        "magnitude": "72",
        "seismic_scale": "07",
        "training_type": "0",
        "epicenter_lat": "33.3",
        "epicenter_lng": "139.5",
        "depth": "10",
        "quake_id": "20150717021556"
    })
}, 5000);
*/

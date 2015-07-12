var request = require("request")
var notifier = require("node-notifier")
var parse = require("xml2json")
var path = require("path");
var moment = require("moment");
var os = require('os');
var oldQuakes = []
require("babel/polyfill");

function getDateTime() {
    return moment().utcOffset(600).format("DD/MM/YYYY  hh:mm:ss");
}

console.log(getDateTime())

function newQuake(quake) {
    if (os.platform() === 'linux' || os.platform() === 'darwin') {
        notifier.notify({
            'title': 'Earthquake Early Warning',
            'subtitle': 'An Earthquake is about to occur in ' + quake.epicenter_code,
            'message': 'Magnitude: ' + quake.magnitude / 10 + ', Seismic Scale: ' + quake.seismic_scale,
            'sound': 'eew',
            'icon': path.join(__dirname, 'icon.png')
        })
    };

    else if (os.platform() == 'win32') {
        notifier.notify({
            'title': 'Earthquake Early Warning',
            'message': 'A Magnitude ' + quake.magnitude / 10 +' Earthquake (Shindo' + quake.seismic_scale + ') is about to occur in ' + quake.epicenter_code + '. Please prepare for strong shaking.',
            'icon': path.join(__dirname, 'icon.png')
        })
    };

    console.log(getDateTime() + " [!] Earthquake Detected, Triggering Event");
    console.log(getDateTime() + " [-] Date/Time: " + moment(quake.eq_date, "X").fromNow() );
    console.log(getDateTime() + " [-] Magnitude: " + quake.magnitude / 10 + "M");
    console.log(getDateTime() + " [-] Seismic: " + quake.seismic_scale);
    console.log(getDateTime() + " [-] Latitude: " + quake.epicenter_lat);
    console.log(getDateTime() + " [-] Longitude: " + quake.epicenter_lng);
    console.log(getDateTime() + " [-] Depth: " + quake.depth + "km");
}

function read(error, response, body) {
    if (error) {
        console.log(error);
    }

    var result = JSON.parse(parse.toJson(body))
    if (oldQuakes.length !== 0) {
        for (var o in result.quakes.quake) {
            var quake = result.quakes.quake[o]
            var notfound = true
            for (var i in oldQuakes) {
                var oldQuake = oldQuakes[i]
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
    oldQuakes = result.quakes.quake
}

/*
function search() {
    request('http://127.0.0.1:8000/test.xml', read)
}
*/

function search() {
    request('http://api.quake.twiple.jp/quake/index.xml', read)
}

setInterval(search, 2000)




var request = require("request");
var notifier = require("node-notifier");
var parseString = require('xml2js').parseString;
var path = require("path");
var moment = require("moment");
var os = require('os');
var oldQuakes = [];
var ipc = require('ipc')

require("babel/polyfill");

function getDateTime() {
    return moment().utcOffset(600).format("DD/MM/YY h:m:ss");
    //return moment().utcOffset(600).format("Do MMM YYYY h:m:ssa");
}

console.log(getDateTime() + ' - Process Started');

function newQuake(quake) {
    if (false && os.platform() === 'linux' || os.platform() === 'darwin') {
        notifier.notify({
            'title': 'Earthquake Early Warning',
            'subtitle': 'An Earthquake is about to occur in ' + quake.epicenter_code,
            'message': 'Magnitude: ' + quake.magnitude / 10 + ', Seismic Scale: ' + quake.seismic_scale,
            'sound': 'eew',
            'icon': path.join(__dirname, 'icon.png')
        });
    } else if (false && os.platform() == 'win32') {
        notifier.notify({
            'title': 'Earthquake Early Warning',
            'message': 'A Magnitude ' + quake.magnitude / 10 + ' Earthquake (Shindo' + quake.seismic_scale + ') is about to occur in ' + quake.epicenter_code + '. Please prepare for strong shaking.',
            'icon': path.join(__dirname, 'icon.png')
        });
    }
    ipc.send('alert' );
    console.log(getDateTime() + " [!] Earthquake Detected, Triggering Event");
    console.log(getDateTime() + " [-] Date/Time: " + moment(quake.eq_date, "X").fromNow());
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
 	ipc.send('alert')
    parseString(xml, function(err, result) {
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

/*
function search() {
    request('http://127.0.0.1:8000/test.xml', read)
}
*/

function search() {
    request('http://api.quake.twiple.jp/quake/index.xml', read);
}

setInterval(function() {
    console.log("run")
    newQuake({
        "eq_date": "1437066950",
        "epicenter_code": "476",
        "magnitude": "47",
        "seismic_scale": "03",
        "training_type": "0",
        "epicenter_lat": "33.3",
        "epicenter_lng": "139.5",
        "depth": "10",
        "quake_id": "20150717021556"
    })
}, 15000);

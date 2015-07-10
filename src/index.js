var request = require("request")
var notifier = require("node-notifier")
var parse = require("xml2json")
var path = require("path");

var oldQuakes = []
require("babel/polyfill");

function newQuake(quake) {
    notifier.notify({
        'title': 'Earthquake Early Warning',
        'subtitle': 'An Earthquake is about to occur in $area',
        'message': 'Magnitude: ' + quake.magnitude / 10 + ', Seismic Scale: ' + quake.seismic_scale,
        'contentImage': void 0,
        'sound': "eew",
        'icon': path.join(__dirname, 'icon.png')
    });
    console.log("Earthquake Detected, Triggering Event");
}

function read(error, response, body) {
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


function search() {
    request('http://127.0.0.1:8000/test.xml', read)
}
setInterval(search, 2000)
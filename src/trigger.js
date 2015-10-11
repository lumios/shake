exports.quake = function() {
    function calc(input) {
        return input[Math.floor(Math.random() * input.length)];
    }

    var magnitude = [
        '3.5', '3.6', '3.7', '3.8', '3.9', '4.0', '4.1', '4.2', '4.3', '4.4', '4.5'
    ];

    var seismic = [
        '2', '3'
    ];

    var depth = [
        '10km', '20km', '30km', '40km', '50km', '60km', '70km', '80km', '90km', '100km'
    ];

    return JSON.stringify({
        "type": "0",
        "drill": true,
        "announce_time": "2015/10/11 07:17:46",
        "earthquake_time": "2015/10/11 07:16:32",
        "earthquake_id": Math.random(),
        "situation": "0",
        "revision": "1",
        "latitude": "36.34",
        "longitude": "141.18",
        "depth": calc(depth),
        "epicenter_en": "Offshore Ibaraki Prefecture",
        "epicenter_ja": "茨城県沖",
        "magnitude": calc(magnitude),
        "seismic_en": calc(seismic),
        "seismic_ja": calc(seismic),
        "geography": "sea",
        "alarm": "0"
    });
};

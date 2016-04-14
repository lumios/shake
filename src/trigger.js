exports.quake = () => {
    return JSON.stringify({
        "version": "1.0.1",
        "type": "0",
        "drill": true,
        "announce_time": "2011/03/11 14:46:24",
        "earthquake_time": "2011/03/11 14:46:24",
        "earthquake_id": Math.random(),
        "situation": "0",
        "update": "#1",
        "revision": "1",
        "latitude": "38.297",
        "longitude": "142.372",
        "depth": '30km',
        "epicenter_en": "Offshore Eastern Tohoku",
        "epicenter_ja": "東北地方東方沖",
        "magnitude": '9.0',
        "seismic_en": '7',
        "seismic_ja": '7',
        "geography": "sea",
        "alarm": "0"
    });
};

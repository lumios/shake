const quake = require('./quake');

exports.main = function() {
    quake.parse({"version":"1.1.0","type":"0","drill":false,"announce_time":"2016/04/16 01:25:13","earthquake_time":"2016/04/16 01:25:07","earthquake_id":"20160416012510","situation":"0","update":"#1","revision":"1","latitude":"32.7","longitude":"130.8","depth":"10km","epicenter_en":"Kumamoto, Kumamoto Prefecture","epicenter_ja":"熊本県熊本地方","magnitude":"5.9","seismic_en":"5+","seismic_ja":"5強","geography":"Land","alarm":"1"});

    setTimeout(() => {
        quake.parse({"version":"1.1.0","type":"0","drill":false,"announce_time":"2016/04/16 01:25:14","earthquake_time":"2016/04/16 01:25:06","earthquake_id":"20160416012510","situation":"0","update":"#2","revision":"2","latitude":"32.7","longitude":"130.7","depth":"10km","epicenter_en":"Kumamoto, Kumamoto Prefecture","epicenter_ja":"熊本県熊本地方","magnitude":"6.3","seismic_en":"6+","seismic_ja":"6強","geography":"Land","alarm":"1"});
    }, 2500);

    setTimeout(() => {
        quake.parse({"version":"1.1.0","type":"0","drill":false,"announce_time":"2016/04/16 01:25:40","earthquake_time":"2016/04/16 01:25:05","earthquake_id":"20160416012510","situation":"0","update":"#3","revision":"3","latitude":"32.8","longitude":"130.8","depth":"10km","epicenter_en":"Kumamoto, Kumamoto Prefecture","epicenter_ja":"熊本県熊本地方","magnitude":"7.1","seismic_en":"7","seismic_ja":"7","geography":"Land","alarm":"1"});
    }, 4000);

    setTimeout(() => {
        quake.parse({"version":"1.1.0","type":"0","drill":false,"announce_time":"2016/04/16 01:26:25","earthquake_time":"2016/04/16 01:25:05","earthquake_id":"20160416012510","situation":"1","update":"Final","revision":"4","latitude":"32.8","longitude":"130.8","depth":"10km","epicenter_en":"Kumamoto, Kumamoto Prefecture","epicenter_ja":"熊本県熊本地方","magnitude":"7.3","seismic_en":"7","seismic_ja":"7","geography":"Land","alarm":"1"});
    }, 6500);
};

var notifier = require('./notifier.js');
var logger = require('./logger.js');
var electron = require('./electron.js');
var locale = require('./resources/lang.json');
var settings = require('./settings.json');
var lang = settings.lang;

function sound(data) {
    if (data.type == 1 || data.situation == 2) return 'simple';
    else return 'nhk';
}

function situation(data) {
    if (data.situation == 1) return locale[lang].units.final;
    else return '#' + data.revision;
}

function template_data(data) {
    if (data.type == 1 || data.situation == 2) return ['', locale[lang].cancelled];
    else {
        var message_template = locale[lang].units.magnitude + ': ' + data.magnitude + ', ' + locale[lang].units.seismic + ': ' + data.seismic_en;
        if (lang == 'ja') return [data.epicenter_ja, message_template];
        else return [data.epicenter_en, message_template];
    }
}

exports.parse = function(input) {
    var date = new Date();
    var data = JSON.parse(input);

    try {
        var sound_string = sound(data);
        var situation_string = situation(data);
        var template = template_data(data);
        var subtitle = template[0];
        var message = template[1];

        if (data.drill) logger.debug('Developer Quake Triggered, Parsing Fake Quake...');
        logger.info(data.earthquake_time + ' - ' + data.epicenter_en);
        logger.info(locale.en.units.update + ' ' + situation_string + ', ' + locale.en.units.magnitude + ': ' + data.magnitude + ', ' + locale.en.units.seismic + ': ' + data.seismic_en);

        // Day Notification
        if (date.getHours() >= '07' || data.magnitude >= 6) {
            notifier.notify(locale[lang].title, subtitle, message, sound_string);
        // Night Notification
        } else {
            logger.debug('Night Mode Enabled, Muting Notification...');
            notifier.notify(locale[lang].title, subtitle, message, false);
        }

        if (data.revision == 1 && electron.electronReady === true) {
            var webContent = alertWindow.webContents;
            webContent.on('did-finish-load', function() {
                webContent.send('data', [data, template, locale]);
            });

            electron.newWindow(data);
        }
/*
        if (data.revision == 1 && (electron.alertRevision[data.earthquake_id] === undefined || data.revision > electron.alertRevision[data.earthquake_id]) && electron.electronReady === true) {
            electron.newWindow(data);
            var alertWindow = electron.alertWindows[data.earthquake_id];


            alertWindow.on('closed', function() {
                alertWindow = null;
            });
        } else if (electronReady === true) {
            if (electron.alertWindows[data.earthquake_id] === undefined) {
                electron.newWindow(data);
                var webContent2 = electron.alertWindows[data.earthquake_id].webContents;
                webContent2.on('did-finish-load', function() {
                    webContent2.send('data', [data, template_date(), locale]);
                });
            } else if (electron.alertRevision[data.earthquake_id] !== undefined && data.revision > electron.alertRevision[data.earthquake_id]) {
                var webContents = electron.alertWindows[data.earthquake_id].webContents;
                webContents.send('data', [data, template_date(), locale]);
                electron.alertRevision[data.earthquake_id] = data.revision;
            }
        }
        */
    } catch (error) {
        notifier.notify(locale[lang].title, '', locale[lang].error + ': ' + error.message, false);
		logger.error('Error: ' + error);
        throw error;
	}
};

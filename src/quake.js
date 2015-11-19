const notifier = require('./notifier');
const logger = require('lumios-toolkit');
const electron = require('./electron');
const locale = require('./resources/lang.json');
const settings = require('./settings.json');
const lang = settings.lang;

function sound(data) {
    if (data.type == 1 || data.situation == 2) return 'Submarine';
    else return 'alert';
}

function situation(data) {
    if (data.situation == 1) return locale[lang].units.final;
    else return '#' + data.revision;
}

function template_data(data) {
    if (data.type == 1 || data.situation == 2) return ['', locale[lang].cancelled];
    else {
        var message_template = locale[lang].units.magnitude + ': ' + data.magnitude + ', ' + locale[lang].units.seismic + ': ' + data.seismic_en + ', ' + locale[lang].units.depth + ': ' + data.depth;
        if (lang == 'ja') return [data.epicenter_ja, message_template];
        else return [data.epicenter_en, message_template];
    }
}

function spawnMap(data, template) {
    if (data.revision == 1 && (electron.alertRevision[data.earthquake_id] === undefined || data.revision > electron.alertRevision[data.earthquake_id]) && electron.electronReady === true) {
        electron.newWindow(data);
        var alertWindow = electron.alertWindows[data.earthquake_id];
        var webContent = electron.alertWindows[data.earthquake_id].webContents;
        webContent.on('did-finish-load', function() {
            webContent.send('data', [data, template, locale]);
        });

        alertWindow.on('closed', function() {
            alertWindow = null;
        });
    } else if (electron.electronReady === true) {
        if (electron.alertWindows[data.earthquake_id] === undefined) {
            electron.newWindow(data);
            var webContent2 = electron.alertWindows[data.earthquake_id].webContents;
            webContent2.on('did-finish-load', function() {
                webContent2.send('data', [data, template, locale]);
            });
        } else if (electron.alertRevision[data.earthquake_id] !== undefined && data.revision > electron.alertRevision[data.earthquake_id]) {
            var webContents = electron.alertWindows[data.earthquake_id].webContents;
            webContents.send('data', [data, template, locale]);
                electron.alertRevision[data.earthquake_id] = data.revision;
        }
    }
}

exports.parse = function(input) {
    const date = new Date();
    var data = JSON.parse(input);

    try {
        var sound_string = sound(data);
        var situation_string = situation(data);
        var template = template_data(data);
        var subtitle = template[0];
        var message = template[1];

        if (data.drill) logger.debug('Developer Quake Triggered, Parsing Fake Quake...');
        if (settings.night_mode && date.getHours() < '06' && data.magnitude <= '6') logger.debug('Night Mode Enabled, Muting Notification...');
        logger.info(data.earthquake_time + ' - ' + data.epicenter_en);
        logger.info(locale.en.units.update + ' ' + situation_string + ', ' + locale.en.units.magnitude + ': ' + data.magnitude + ', ' + locale.en.units.seismic + ': ' + data.seismic_en);

        // Night Notification
        if (settings.night_mode && date.getHours() < '06' && data.magnitude <= '6') {
            notifier.notify(locale[lang].title, subtitle, message, false, spawnMap(data, template));
        }

        // Day Notification
        else notifier.notify(locale[lang].title, subtitle, message, sound_string, spawnMap(data, template));
    } catch (error) {
        notifier.notify(locale[lang].title, '', locale[lang].error + ': ' + error.message, false);
		logger.error(error);
        throw error;
	}
};

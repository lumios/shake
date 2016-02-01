const path = require('path');
const crimson = require('crimson');
const macifier = require('node-notifier').NotificationCenter;
const notifier = require('node-notifier');

var notifier_mac = new macifier({
    customPath: path.join(__dirname, '../', 'lib', 'shake.app', 'Contents', 'MacOS', 'terminal-notifier')
});

exports.notify = (title, subtitle, message, sound, callback) => {
    if (process.platform === 'darwin') {
        return notifier_mac.notify({
            'title': title,
            'subtitle': subtitle,
            'message': message,
            'sound': sound,
            'time': 8000,
            'wait': true
        }, (error, response) => {
            if (error) crimson.error('Error: ' + error);
            if (callback) callback();
        });
    } else {
        return notifier.notify({
            'title': title,
            'subtitle': subtitle,
            'message': message,
            'sound': sound,
            'urgency': 'critical',
            'time': 8000,
            'icon': path.join(__dirname, 'resources', 'IconLogo.png')
        }, (error, response) => {
            if (error) crimson.error('Error: ' + error);
            if (callback) callback();
        });
    }
};

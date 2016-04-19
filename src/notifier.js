const path = require('path');
const Crimson = require('crimson');
const crimson = new Crimson({ path: path.join(__dirname, 'logs') });
const macifier = require('node-notifier').NotificationCenter;
const notifier = require('node-notifier');

var notifier_mac = new macifier({
    customPath: path.join(__dirname, 'lib', 'notifier.app', 'Contents', 'MacOS', 'terminal-notifier')
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
            if (error) crimson.error(error);
            if (callback) callback();
        });
    } else {
        return notifier.notify({
            'title': title,
            'message': subtitle + (subtitle ? '\n' : '') + message,
            'sound': sound,
            'urgency': 'normal',
            'time': 8000,
            'icon': path.join(__dirname, 'resources', 'IconLogo.png')
        }, (error, response) => {
            if (error) crimson.error(error);
            if (callback) callback();
        });
    }

    crimson.debug('Spawning Notification');
};

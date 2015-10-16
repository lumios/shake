var path = require('path');
var logger = require('./logger.js');
if (process.platform === 'darwin') {
	var notifier = require(path.join(__dirname, './lib', 'node-notifier'));
} else var notifier = require('node-notifier');

exports.notify = function(title, subtitle, message, sound) {
	if (process.platform === 'darwin') {
		return notifier.notify({
			'title': title,
			'subtitle': subtitle,
			'message': message,
			'sound': sound,
			'time': 10000,
			'wait': true
		}, function (error, response) {
			if (error) logger.error('Error: ' + error);
		});
	} else {
		return notifier.notify({
			'title': title,
			'subtitle': subtitle,
			'message': message,
			'sound': sound,
			'urgency': 'critical',
			'time': 10000,
			'wait': true,
			'icon': path.join(__dirname, 'resources', 'eew-logo.png')
		}, function (error, response) {
			if (error) logger.error('Error: ' + error);
		});
	}
};

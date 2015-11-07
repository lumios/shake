var path = require('path');
var logger = require('lumios-toolkit');
if (process.platform === 'darwin') {
	var notifier = require(path.join(__dirname, '../lib', 'node-notifier'));
} else var notifier = require('node-notifier');

exports.notify = function(title, subtitle, message, sound, callback) {
	if (process.platform === 'darwin') {
		return notifier.notify({
			'title': title,
			'subtitle': subtitle,
			'message': message,
			'sound': sound,
			'time': 8000,
			'wait': true
		}, function (error, response) {
			if (error) logger.error('Error: ' + error);
			callback;
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
		}, function (error, response) {
			if (error) logger.error('Error: ' + error);
			callback;
		});
	}
};

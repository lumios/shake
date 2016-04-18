//const socket_url = 'http://0.0.0.0:1190';
const socket_url = 'http://shakeserv.kurisubrooks.com:1190';
const socket = require('socket.io-client')(socket_url);
const path = require('path');
const fs = require('fs-extra');
const open = require('open');
const crimson = require('crimson');
const crashReporter = require('electron').crashReporter;

var appDir;
var settingsPath = path.join(__dirname, 'settings.json');

/*
// Setting App Directories
*/

if (process.platform === 'win32') {
    appDir = path.join(process.env.APPDATA, 'Shake', 'App');
} else if (process.platform === 'darwin') {
    appDir = path.join(process.env.HOME, 'Library', 'Application Support', 'Shake', 'App');
} else if (process.platform === 'linux') {
    appDir = path.join('/', 'usr', 'share', 'shake', 'app');
} else {
    crimson.fatal('Unknown Operating System, can\'t create/find settings');
}

/*
// Loads / Generates Settings
*/

if (!fs.existsSync(settingsPath)) {
    var settingsFile = { "lang": "en", "min_alert": "35", "first_run": true, "night_mode": false, "dev_mode": true };
    crimson.warn('Settings File does not exist, generating...');

    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settingsFile));
    } catch (error) {
        crimson.fatal(error);
    }

    var settings = require('./settings.json');
    crimson.success('Generated Settings File');
} else {
    var settings = require('./settings.json');
    crimson.success('Loaded Settings.');
}

/*
// Import Modules
*/

const electron = require('./electron');
const notifier = require('./notifier');
const trigger = require('./trigger');
const locale = require('./resources/lang.json');
const quake = require('./quake');
const lang = settings.lang;

/*
// Installs Notification Sounds for OS X
*/

if (process.platform === 'darwin') {
    const copy = path.join(__dirname, 'resources', 'audio');
    const paste = path.join(process.env.HOME, 'Library', 'Sounds');

    fs.copy(copy, paste, (error) => {
        if (error) crimson.fatal(error);
        crimson.success('Installed Sounds to [' + paste + ']');
    });
}

/*
// Server Connection
*/

socket.on('connect', () => {
    socket.emit('open', { version: '1.2' });
});

socket.on('auth', (data) => {
    if (data.ok) {
        crimson.success('Connected to Server.');
        notifier.notify(locale[lang].title, '', locale[lang].connect, false);
    } else {
        notifier.notify(locale[lang].title, '', locale[lang].conn_refused, false);
        crimson.fatal('Connected to Server Refused, Crashing.');
    }
});

socket.on('data', (data) => {
    crimson.debug('Earthquake Occurred, Triggering Parser...');
    quake.parse(data);
});

socket.on('disconnect', () => {
    crimson.error('Socket Dropped, Trying to reconnect...');
    notifier.notify(locale[lang].title, '', locale[lang].disconnect, false);
});

/*
// Electron's Bullshit
*/

if (process.platform == 'darwin') electron.app.dock.hide();
var appTray, contextMenu = null;

electron.app.on('ready', () => {
    electron.electronReady = true;

    if (settings.first_run) {
        electron.newSettings();
        crimson.debug('First run, opening settings window...');
    }

    if (process.platform == 'darwin') {
        appTray = new electron.Tray(path.join(__dirname, 'resources', 'IconTemplate.png'));
        appTray.setPressedImage(path.join(__dirname, 'resources', 'IconPressed.png'));
    } else if (process.platform == 'win32') {
        appTray = new electron.Tray(path.join(__dirname, 'resources', 'IconTest.png'));
    } else {
        appTray = new electron.Tray(path.join(__dirname, 'resources', 'IconPressed.png'));
    }

    var nodev_template = [
        {label: locale[lang].menu.about,click: () => electron.newAbout()},
        {type: 'separator'},
        {label: locale[lang].menu.help,click: () => open('http://lumios.xyz/support.html')},
        {label: locale[lang].menu.settings,click: () => electron.newSettings()},
        {type: 'separator'},
        {label: locale[lang].menu.contribute,click: () => open('https://github.com/lumios/eew')},
        {label: locale[lang].menu.bug,click: () => open('https://github.com/lumios/eew/issues')},
        {type: 'separator'},
        {label: locale[lang].menu.quit,click: () => {
            crimson.debug('Closed via Tray Menu');
            electron.app.quit();
        }}
    ];

    var dev_template = [
        {label: locale[lang].menu.about,click: () => electron.newAbout()},
        {type: 'separator'},
        {label: locale[lang].menu.help,click: () => open('http://lumios.xyz/support.html')},
        {label: locale[lang].menu.settings,click: () => electron.newSettings()},
        {type: 'separator'},
        {label: locale[lang].menu.contribute,click: () => open('https://github.com/lumios/eew')},
        {label: locale[lang].menu.bug,click: () => open('https://github.com/lumios/eew/issues')},
        {type: 'separator'},
        {label: locale[lang].menu.devtools, submenu:[
            {label: locale[lang].menu.test,click: () => quake.parse(trigger.quake())}
        ]},
        {type: 'separator'},
        {label: locale[lang].menu.quit,click: () => {
            crimson.debug('Closed via Tray Menu');
            electron.app.quit();
        }}
    ];

    if (settings.dev_mode) contextMenu = electron.Menu.buildFromTemplate(dev_template);
    else contextMenu = electron.Menu.buildFromTemplate(nodev_template);

    appTray.setToolTip('Shake');
    appTray.setContextMenu(contextMenu);
});

electron.app.on('window-all-closed', () => {
    if (process.platform == 'darwin') electron.app.dock.hide();
    return;
});

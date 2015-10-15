/*
// String Prototypes
*/

String.prototype.contains = function(str) {
    return this.indexOf(str) >= 0;
};

String.prototype.startsWith = function(str) {
    return this.indexOf(str) === 0;
};

/*
// Console + Log to file
*/

var color = require('colors');
var moment = require('moment');
var fs = require('fs');

var dir = __dirname + './logs';
var log = __dirname + './logs/output.log';

color.setTheme({
    success: ['green', 'bold'], info: ['blue', 'bold'],
    debug: ['magenta', 'bold'], warn: ['yellow', 'bold'], error: ['red', 'bold']
});

// Creates logs directory if doesn't exist
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
fs.appendFile(log, '\n[%]' + getTime() + '>> \n', function(error){
    if (error) console.log(('[!]' + getTime() + error).error);
});

// Gets the current time, styled
function getTime() {
    return ' [' + moment().format('DD/MM/YYYY h:mm:ssa') + '] ';
}

// Logs the input to the log file
function log2file(input) {
    fs.appendFile(log, input + '\n', function(error) {
        if (error) console.log(('[!]' + getTime() + error).error);
    });
}

exports.log = function(level, message) {
    var time = getTime();

    if (level == 'success') {
        console.log(('[*]' + time + message).success);
        log2file('[*]' + time + message);
    }

    else if (level == 'info') {
        console.log(('[*]' + time + message).info);
        log2file('[*]' + time + message);
    }

    else if (level == 'debug') {
        console.log(('[~]' + time + message).debug);
        log2file('[*]' + time + message);
    }

    else if (level == 'warn') {
        console.log(('[~]' + time + message).warn);
        log2file('[*]' + time + message);
    }

    else if (level == 'error') {
        console.log(('[!]' + time + message).error);
        log2file('[*]' + time + message);
    }

    else {
        console.log(('[!]' + time + '"' + level + '" is not a valid operand.').error);
    }
};

exports.success = function(message) {
    var time = getTime();
    console.log(('[*]' + time + message).success);
    log2file('[*]' + time + message);
};

exports.info = function(message) {
    var time = getTime();
    console.log(('[*]' + time + message).info);
    log2file('[*]' + time + message);
};

exports.debug = function(message) {
    var time = getTime();
    console.log(('[~]' + time + message).debug);
    log2file('[~]' + time + message);
};

exports.warn = function(message) {
    var time = getTime();
    console.log(('[~]' + time + message).warn);
    log2file('[~]' + time + message);
};

exports.error = function(message) {
    var time = getTime();
    console.log(('[!]' + time + message).error);
    log2file('[!]' + time + message);
};

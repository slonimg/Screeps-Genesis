/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('logger');
 * mod.thing == 'a thing'; // true
 */

const levels = {
    'debug': 0,
    'info' : 1,
    'warning': 2,
    'error': 3
};

const loglevel = levels['info'];
let log = (level, message) => {
    if (loglevel <= levels[level]) {
        console.log(message)
    }
};
let debug = (message) => { log('debug', message) };
let info = (message) => { log('info', message) };
let warning = (message) => { log('warning', message) };
let error = (message) => { log('error', message) };

module.exports = {
    debug,
    info,
    warning,
    error
};
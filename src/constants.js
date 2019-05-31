/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('constants');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    // available roles
    roles: {
        HARVESTER: 1,
        UPGRADER: 2,
        BUILDER: 3,
        MINER: 4
    },

    // room bot configuration
    room: {
        harvesters: 6,
        upgraders: 8,
        builders: 4
    }
};
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.harvester');
 * mod.thing == 'a thing'; // true
 */
const constants = require('constants');
const utils = require('utils');
// const layout2 = [WORK, WORK, WORK, CARRY, MOVE];
const layout = [WORK, CARRY, MOVE];

let run = (creep) => {
    if (creep.carry.energy === 0 && !creep.memory.harvesting) {
        creep.memory.harvesting = true;
    }
    if (creep.memory.harvesting && creep.carry.energy === creep.carryCapacity) {
        creep.memory.harvesting = false;
    }

    if (creep.memory.harvesting)
        utils.getEnergy(creep);
    else if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE){
        creep.moveTo(creep.room.controller);
    }
};

let createExpander = (spawn, name) => {
    if (!name) {
        name =  'Expander_' + spawn.name + '_' + Game.time;
    }
    return spawn.spawnCreep(layout, name, {
        memory: { role: constants.roles.UPGRADER }
    });
};

module.exports = {
    run,
    createExpander,
};
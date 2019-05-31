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
const layouts = [
    [WORK, CARRY, MOVE, CARRY, MOVE],
    [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
];

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

let getCreepLayout = (spawn) => {
    let layout;
    let foundLayout = false;
    for (let i = layouts.length-1; !foundLayout && i >= 0; i--) {
        layout = layouts[i];
        let cost = utils.getBodyCost(layout);
        if (cost <= spawn.room.energyCapacityAvailable)
            foundLayout = true;
    }

    return foundLayout ? layout : undefined;
};

let createUpgrader = (spawn, name) => {
    if (!name) {
        name =  'Upgrader_' + spawn.name + '_' + Game.time;
    }

    let result = undefined;
    let layout = getCreepLayout(spawn);
    if (layout) {
        result = spawn.spawnCreep(layout, name, {
            memory: { role: constants.roles.UPGRADER }
        });
    }
    return result;
};

module.exports = {
    run,
    createUpgrader,
};
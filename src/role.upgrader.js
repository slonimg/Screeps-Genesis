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
// const layout = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
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

let createUpgrader = (spawn: StructureSpawn, name: string) => {
    if (!name) {
        name =  'Upgrader_' + spawn.name + '_' + Game.time;
    }

    let result;
    for (let i = layouts.length-1; i >= 0; i--) {

        let layout = layouts[i];
        result = spawn.spawnCreep(layout, name, {
            memory: { role: constants.roles.UPGRADER }
        });

        if (result !== ERR_NOT_ENOUGH_ENERGY) {
            break;
        }
    }
    return result;
};

module.exports = {
    run,
    createUpgrader,
};
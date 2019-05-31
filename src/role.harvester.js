/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.harvester');
 * mod.thing == 'a thing'; // true
 */
const consts = require('constants');
let roles = consts.roles;
const utils = require('utils');

const layout = [WORK, CARRY, MOVE, CARRY, MOVE];
let run = (creep) => {
    if (creep.carry.energy < creep.carryCapacity) return utils.getEnergy(creep);

    let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                structure.energy < structure.energyCapacity;
        }
    });
    if (targets.length === 0) {
        targets = [Game.spawns['Spawn1']];
    }
    if (targets.length > 0)
        utils.transferEnergy(creep, targets[0]);

};

let createHarvester = (spawn, name) => {
    if (!name) {
        name =  `Harvester_${Game.time}`;
    }
    return spawn.spawnCreep(layout, name,{
        memory: {
            role: roles.HARVESTER
        }
    });
};

module.exports = {
    run,
    createHarvester,
};
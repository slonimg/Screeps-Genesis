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
const logger = require('logger');

const layout = [WORK, CARRY, MOVE, CARRY, MOVE];
let run = (creep) => {
    if (creep.carry.energy < creep.carryCapacity) return utils.getEnergy(creep);

    let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
    });

    // Put resources in hive
    if (targets.length > 0)
        utils.transferEnergy(creep, targets[0]);

    // or Clear the way (move to rally flag or Spawn and wait there)
    else {
        let rallyFlag = Game.flags['Rally'];
        let target = rallyFlag ? rallyFlag : Game.spawns['Spawn1'];
        let moveResult = creep.moveTo(target.pos);
        logger.info(`move resulted in ${moveResult}`);
    }

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
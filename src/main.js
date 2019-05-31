let harvester = require('role.harvester');
let upgrader = require('role.upgrader');
let builder = require('role.builder');
let constants = require('constants');
let roles = constants.roles;
let logger = require('logger');
let roomManager = require('room.manager');

let memoryCleanup = () => {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
};

let spawnCreeps = () => {
    logger.info('spawning creeps');
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === roles.HARVESTER);
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === roles.UPGRADER);
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role === roles.BUILDER);

    if (harvesters.length < constants.room.harvesters) {
        logger.info('Spawning harvester');
        harvester.createHarvester(Game.spawns['Spawn1'])
    }
    else if (upgraders.length < constants.room.upgraders) {
        logger.info('Spawning upgrader');
        upgrader.createUpgrader(Game.spawns['Spawn1'])
    } else if (builders.length < constants.room.builders) {
        logger.info('Spawning builder');
        logger.debug(builder.createBuilder(Game.spawns['Spawn1']))

    } else {
        logger.info('no creeps spawned');
    }

    return {
        harvesters: harvesters.length,
        upgraders: upgraders.length,
        builders: builders.length
    }
};


let roleRunners = {};
roleRunners[roles.HARVESTER] = harvester;
roleRunners[roles.UPGRADER] = upgrader;
roleRunners[roles.BUILDER] = builder;

module.exports.loop = function () {
    memoryCleanup();

    for (let name in Game.creeps) {
        // console.log('processing ', name)
        let creep = Game.creeps[name];
        let role = creep.memory.role;
        roleRunners[role].run(creep);
    }

    let counts = spawnCreeps();
    logger.info('** Status Report **');
    logger.info(`Harvesters: ${counts.harvesters}/${constants.room.harvesters}`);
    logger.info(`Upgraders: ${counts.upgraders}/${constants.room.upgraders}`);
    logger.info(`Builders:  ${counts.builders}/${constants.room.builders}`);
    logger.info(`*******************`);

    if (!Memory.roomNames) {
        let spawn = Game.spawns['Spawn1'];
        Memory.roomNames = [spawn.room.name];
    }

    for (let room in Memory.roomNames) {
        roomManager.run(Memory.roomNames[room]);
    }
};





// constants
const constants = require('constants');
const roles = constants.roles;
const logger = require('logger');

// roles
const harvester = require('role.harvester');
const upgrader = require('role.upgrader');
const builder = require('role.builder');

// room functions
const roomManager = require('room.manager');
const tasksManager = require('room.tasks');
const towersManager = require('room.towers');

const memoryCleanup = () => {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
};

const spawnCreeps = () => {
    logger.info('spawning creeps');
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === roles.HARVESTER);
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === roles.UPGRADER);
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role === roles.BUILDER);
    let spawn = Game.spawns['Spawn1'];

    if (!spawn.room.memory.sources) {
        spawn.room.memory.sources = spawn.room.find(FIND_SOURCES).length;
    }

    if (harvesters.length < spawn.room.memory.sources*3) {
        logger.info('Spawning harvester');
        logger.debug(harvester.createHarvester(spawn));
    }
    else if (upgraders.length < constants.room.upgraders) {
        logger.info('Spawning upgrader');
        logger.debug(upgrader.createUpgrader(spawn));
    } else if (builders.length < constants.room.builders) {
        logger.info('Spawning builder');
        logger.debug(builder.createBuilder(spawn))
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

let logStatus = (counts) => {

    logger.info(`***** Status Report - ${Game.time} *****`);
    logger.info(`Harvesters: ${counts.harvesters}/${constants.room.harvesters}`);
    logger.info(`Upgraders: ${counts.upgraders}/${constants.room.upgraders}`);
    logger.info(`Builders:  ${counts.builders}/${constants.room.builders}`);
    logger.info(`***********************************`);


};

function runCreeps() {
    for (let name in Game.creeps) {
        logger.debug(`processing ${name}`);
        let creep = Game.creeps[name];
        let role = creep.memory.role;
        roleRunners[role].run(creep);
    }
}

function populateRoomNames() {
    try {
        if (!Memory.roomNames) {
            let spawn = Game.spawns['Spawn1'];
            Memory.roomNames = [spawn.room.name];
        }
    } catch (e) {
        logger.warning('error in populating room names', e)
    }
}

function runRooms() {
    for (let key in Memory.roomNames) {
        let roomName = Memory.roomNames[key];
        let room = Game.rooms[roomName];
        roomManager.run(room);
        tasksManager.run(room);
        towersManager.run(room);
    }
}

module.exports.loop = function () {
    memoryCleanup();
    console.log();
    logger.info(`********** Tick - ${Game.time} **********`);

    runCreeps();
    let counts = spawnCreeps();

    populateRoomNames();
    runRooms();
    logStatus(counts);
};





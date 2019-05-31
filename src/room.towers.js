const logger = require('logger');

let runRepairs = (room, towers, initialIndex) => {
    let targets = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_TOWER ||
                structure.structureType === STRUCTURE_ROAD) && structure.hits < structure.hitsMax - 200;
        }
    });

    let towerIdx = initialIndex;
    logger.debug(`repairs: ${targets.length}`);
    logger.debug(`available towers: ${towers.length-initialIndex}`);
    for (let idx in targets) {
        if (towerIdx < towers.length) {
            let tower = towers[towerIdx];
            let target = targets[idx];

            if (target === tower) continue;
            tower.repair(target);
            towerIdx++;
        } else {
            break;
        }
    }
    return towerIdx;
};

let healCreeps = (room, towers, initialIndex) => {
    let targets = room.find(FIND_CREEPS, {
        filter: (creep) => { return creep.my && creep.hits <= creep.hitsMax-200 }
    });

    let towerIdx = initialIndex;
    logger.debug(`heals: ${targets.length}`);
    logger.debug(`available towers: ${towers.length-initialIndex}`);
    for (let idx in targets) {
        if (towerIdx < towers.length) {
            let tower = towers[towerIdx];
            let target = targets[idx];

            if (target === tower) continue;
            tower.heal(target);
            towerIdx++;
        } else {
            break;
        }
    }
    return towerIdx;

};

let attackCreeps = (room, towers, initialIndex) => {
    let targets = room.find(FIND_HOSTILE_CREEPS);
    let otherTargets = room.find(FIND_CREEPS);
    let myTargets = room.find(FIND_MY_CREEPS);

    let towerIdx = initialIndex;
    logger.info(`foes: ${targets.length}`);
    logger.info(`mine: ${myTargets.length}`);
    logger.info(`all: ${otherTargets.length}`);
    logger.info(`available towers: ${towers.length-initialIndex}`);

    if (targets.length > 0) {
        for (let targetKey in targets) {
            let target = targets[targetKey];
            while (towerIdx < towers.length) {
                towerIdx++;
                let tower = towers[towerIdx];
                tower.attack(target);
            }
        }
    }
    return towerIdx;
};

let run = (room) => {
    let towers = room.find(FIND_STRUCTURES, {
        filter: (structure) => { return structure.structureType === STRUCTURE_TOWER && structure.energy >= 10 }
    });

    logger.info(`available towers: ${towers.length}`);
    let towerIdx = 0;
    towerIdx = attackCreeps(room, towers, towerIdx);
    towerIdx = healCreeps(room, towers, towerIdx);
    towerIdx = runRepairs(room, towers, towerIdx);

    logger.info(`towers left without work: ${towers.length - towerIdx}`);

};

module.exports = {
    run,
};
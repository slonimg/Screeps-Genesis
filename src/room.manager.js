const logger = require('logger');

// let visualizeRoad = (room, startPos, endPos) => {
    // room.visual.line()
// };

let visualizeSpawn = (room, pos) => {
    room.visual.circle(pos, {fill: 'transparent', radius: 0.55, stroke: 'white'});
    room.visual.circle(pos, {fill: 'yellow', radius: 0.35, stroke: 'black'});
};

let planSpawnner = (room) => {
    let spawnFlags = room.find(FIND_FLAGS, {
        filter: (flag) => {
            return flag.color === COLORS_ALL[COLOR_PURPLE]-1
        }
    });
    if (spawnFlags && spawnFlags.length > 0) {
        let spawn = spawnFlags[0];
        visualizeSpawn(room, spawn.pos);
    } else {
        logger.debug(`flag not found`);
    }
};

// let planMiningRig = (room) => {
//     let sources = room.find(FIND_SOURCES);
//
//     for (let source in sources) {
//
//         let position = source.pos;
//
//         for (let x = -1; x <= 1; x ++) {
//             for (let y = -1; y <=1; y++) {
//                 room.visual.rect(position.x + x, position.y + y, 0.4, 0.4, {fill: 'red'})
//             }
//         }
//     }
//
// };

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
    let targets = room.find(FIND_CREEPS, {
        filter: (creep) => { return !creep.my }
    });

    let towerIdx = initialIndex;
    logger.debug(`foes: ${targets.length}`);
    logger.debug(`available towers: ${towers.length-initialIndex}`);

    if (targets.length > 0) {
        let target = targets[0];
        while (towerIdx < towers.length) {
            towerIdx++;
            let tower = towers[towerIdx];
            tower.attack(target);
        }
    }
    return towerIdx;
};
let operateTowers = (room) => {
    let towers = room.find(FIND_STRUCTURES, {
        filter: (structure) => { return structure.structureType === STRUCTURE_TOWER && structure.energy >= 10 }
    });

    logger.info(`available towers: ${towers.length}`);
    let towerIdx = 0;
    towerIdx = healCreeps(room, towers, towerIdx);
    towerIdx = attackCreeps(room, towers, towerIdx);
    towerIdx = runRepairs(room, towers, towerIdx);

    logger.info(`towers left without work: ${towers.length - towerIdx}`);
};

/***
 *
 * @param room
 * @type Room
 */
let run = (room) => {
    // no plan in room
    logger.info(`Room Manager: running room ${room.name}`);

    let mem = room.memory;
    if (!mem.plan) {
        mem.plan = {
            isPlanning: true
        };
    }

    if (mem.plan.isPlanning) {
        logger.info(`Room Manager: planning room`);
        planSpawnner(room);
        // planMiningRig(room);

        operateTowers(room);
    }
};

module.exports = {
    run,
};
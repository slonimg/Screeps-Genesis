const logger = require('logger');

// let warehouse = {
//
// };

let visualizeRoad = (room, startPos, endPos) => {
    logger.info(`visualizing road: ${startPos}, ${endPos}`);
    Memory.vis = {start: startPos, end: endPos};
    room.visual.line(startPos, endPos, { fill: 'grey', width: 0.25 })
};

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
    if (room.memory.plan.isPlanning && spawnFlags && spawnFlags.length > 0) {
        let spawn = spawnFlags[0];
        visualizeSpawn(room, spawn.pos);
        let roadStart = new RoomPosition(spawn.pos.x, spawn.pos.y, room.name);
        let roadEnd = new RoomPosition(spawn.pos.x, spawn.pos.y-2, room.name);
        visualizeRoad(room, roadStart, roadEnd);
    } else {
        logger.debug(`flag not found`);
    }
};

let planMiningRig = (room) => {
    let sources = room.find(FIND_SOURCES);

    for (let i in sources) {
        let source = sources[i];
        let position = source.pos;

        for (let x = -1; x <= 1; x ++) {
            for (let y = -1; y <=1; y++) {
                room.visual.rect(position, 0.4, 0.4, {fill: 'yellow'})
            }
        }
    }
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
        planMiningRig(room);
    }
};

module.exports = {
    run,
};
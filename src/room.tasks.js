// const utils = require('utils');
const logger = require('logger');

/***
 *
 * @param room (optional) the room which tasks object should be returned
 * @returns tasks object of the room given, global tasks object otherwise
 */
let getTasks = (room) => {
    if (!Memory.tasks) {
        Memory.tasks = {};
    }

    if (room) {
        if (!Memory.tasks[room.name]) {
            Memory.tasks[room.name] = {}
        }
        return Memory.tasks[room.name];
    }
    return Memory.tasks;
};

let logRoomTasks = (tasks) => {
    logger.debug(`tasks ${tasks}`);
};

/***
 *
 * @param room
 * @type Room
 */
let getRoutineTasks = (room) => {
    logger.debug(`get routine tasks: ${room}`);
    let tasks = getTasks(room);

    let sources = room.find(FIND_SOURCES);

    // create mine source task
    for (let idx in sources) {
        let source = sources[idx];
        let taskKey = `mine_source_${source.id}`;
        if (!tasks[taskKey]) {
            tasks[taskKey] = {
                creationTime: Game.time,
                updateTime: Game.time,
                taskKey: taskKey,
                creep: {
                    name: undefined,
                    assignTime: undefined,
                    ticksToAge: undefined
                }
            }
        }
    }
    return getTasks(room);
};

let run = (room) => {
    let tasks = getRoutineTasks(room);
    logRoomTasks(tasks);
};

module.exports = {
    run,
};
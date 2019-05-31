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
    logger.info(`tasks ${tasks}`);
};

/***
 *
 * @param room
 * @type Room
 */
let getRoutineTasks = (room) => {
    let sources = room.find(FIND_SOURCES);
    let tasks = getTasks(room);

    for (let source in sources) {
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
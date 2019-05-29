const logger = require('logger');


let getEnergy = (creep, source) => {
    if (!source) {
        source = creep.pos.findClosestByPath(FIND_SOURCES);
        logger.debug(`${creep} - source is null`);
    }
    logger.debug(`${creep} - source: ${source}`);
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        logger.debug('source not in range moving to source');
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
};

let transferEnergy = (creep, source) => {
    if (creep.transfer(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
    }
};

let getBodyCost  = (body) => {
    let cost = 0;
    for (let part in body) {
        cost += BODYPART_COST[part];
    }
    return cost;
};

module.exports = {
    getEnergy,
    getBodyCost,
    transferEnergy,
};

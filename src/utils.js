const logger = require('logger');


let getEnergy = (creep, source) => {
    if (!source) {
        source = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (source) => { return source.energy > 0 }
        });
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
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
    }
};

let getBodyCost  = (body) => {
    let cost = 0;
    for (let part in body) {
        cost += BODYPART_COST[body[part]];
    }
    return cost;
};

let getCreepLayout = (spawn, layouts) => {
    let layout;
    let foundLayout = false;
    logger.debug('getting layout');
    for (let i = layouts.length-1; !foundLayout && i >= 0; i--) {
        layout = layouts[i];
        let cost = getBodyCost(layout);
        logger.debug(`checking layout: ${layout}, cost: ${cost}, availableEnergyCap: ${spawn.room.energyCapacityAvailable}`);

        if (cost <= spawn.room.energyCapacityAvailable)
            foundLayout = true;
    }

    return foundLayout ? layout : undefined;
};

module.exports = {
    getEnergy,
    getBodyCost,
    transferEnergy,
    getCreepLayout
};

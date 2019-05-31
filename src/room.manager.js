const logger = require('logger');

// let warehouse = {
//
// };

let visualizeRoad = (room, startPos, endPos) => {
    logger.debug(`visualizing road: ${startPos}, ${endPos}`);
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
        for (let x = -1; x <= 1; x ++) {
            for (let y = -1; y <=1; y++) {
                let pos = getOptimalSourceContainerPosition(room, source, room.find(FIND_MY_SPAWNS)[0]);
                room.visual.rect(pos.x-.2,pos.y-.2, 0.4, 0.4, {fill: 'yellow'});

                if (!room.memory.plan.rigs) {
                    room.memory.plan.rigs = {};
                }

                room.memory.plan.rigs[source.id] = {
                    containerPosition: pos
                };
            }
        }
    }
};

const direction = [1,0,-1];
/**
 *
 * @param room
 * @type Room
 * @param source
 * @type Source
 * @param spawn
 * @type Spawn
 */
let getOptimalSourceContainerPosition = (room, source, spawn) => {
  let containerPositions = [];
  for (let i=0; i<direction.length; i++) {
      for (let j=0; j<direction.length; j++) {
          let x=direction[i];
          let y=direction[j];
          if (x===y && x===0) continue;
          let position = new RoomPosition(source.pos.x+x, source.pos.y+y, room.name);
          let terrain = _.filter(position.look(), (item) => { return item['type'] === 'terrain' });
          if (terrain.length > 0 && terrain[0]['terrain'] !== 'wall') containerPositions.push(position);
      }
  }

  return spawn.pos.findClosestByRange(containerPositions);
};

let planRoads = (room) => {
    logger.debug(`planning roads in room ${room.name}`)
};

let needsNewConstructionSite = (room) => {
    let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
    return constructionSites.length === 0;
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
        planRoads(room);


        if (needsNewConstructionSite(room)) {
            logger.info('here');
            let rigs = room.memory.plan.rigs;
            for (let key in rigs) {
                let rig = rigs[key];
                let pos = rig.containerPosition;
                pos = new RoomPosition(pos.x, pos.y, pos.roomName);
                let hasStructure = _.filter(pos.look(), {'type': 'structure', 'structure': {'type' : STRUCTURE_CONTAINER}});
                if (hasStructure.length === 0) {
                    room.createConstructionSite(pos, STRUCTURE_CONTAINER);
                    break;
                }
            }
        }
    }
};

module.exports = {
    run,
};
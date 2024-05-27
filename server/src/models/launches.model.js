
// const launches = new Map();
const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo')

let latestFlightNumber = 100;

const launch = {
    flightNumber: latestFlightNumber,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customes: ['ZTM','NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);

console.log(launch.flightNumber);

// launches.set(launch.flightNumber, launch);

function existLaunch(launchId) {
    return launchesDB.has(launchId);
}

async function getAllLaunches() {
    return await launchesDB
    .find({}, {'_id':0, '__v':0});
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    })

    if (!planet){
        throw new Error('No matching planet was found!')
    }

    await launchesDB.updateOne(
        {flightNumber: launch.flightNumber,},
        launch,
        {upsert: true})
    }

function addNewLaunches(launch) {
    latestFlightNumber+=1;
    launchesDB.set(
    latestFlightNumber,
    Object.assign(launch,  {
        flightNumber: latestFlightNumber,
        customers : ["Zero to Mastery", "NASA"],
        upcoming : true,
        success: true,
        } )
    )
}

function abortLaunchById(launchId) {
    // launch.delete(launchId);
    const aborted = launchesDB.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}
module.exports = {
    getAllLaunches,
    addNewLaunches,
    existLaunch,
    abortLaunchById,
};
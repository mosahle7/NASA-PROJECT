
// const launches = new Map();
const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo')

const  DEFAULT_FLGHT_NUMBER = 100;

const launch = {
    flightNumber: DEFAULT_FLGHT_NUMBER,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customes: ['ZTM','NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);

// console.log(launch.flightNumber);

// launches.set(launch.flightNumber, launch);

async function existLaunch(launchId) {
    return await launchesDB.findOne({
        flightNumber: launchId,
    })

    }

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB
    .findOne()
    .sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLGHT_NUMBER;
    }
    
    
    return latestLaunch.flightNumber
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

    await launchesDB.findOneAndUpdate(
        {flightNumber: launch.flightNumber,},
        launch,
        {upsert: true})
    }

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;
    
    console.log(`latest: ${newFlightNumber}`);
    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        success: true,
        upcoming: true,
        customers : ["Zero to Mastery", "NASA"],
    });

    await saveLaunch(newLaunch);
}

// function addNewLaunches(launch) {
//     latestFlightNumber+=1;
//     launchesDB.set(
//     latestFlightNumber,
//     Object.assign(launch,  {
//         flightNumber: latestFlightNumber,
//         customers : ["Zero to Mastery", "NASA"],
//         upcoming : true,
//         success: true,
//         } )
//     )
// }

async function abortLaunchById(launchId) {
    const aborted = await launchesDB.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    })
    // return aborted
    // launch.delete(launchId);
    // const aborted = launchesDB.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    return aborted.modifiedCount === 1;
}
module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existLaunch,
    abortLaunchById,
};
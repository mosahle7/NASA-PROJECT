const axios = require('axios');
// const launches = new Map();
const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo')

const  DEFAULT_FLGHT_NUMBER = 100;

const launch = {
    flightNumber: DEFAULT_FLGHT_NUMBER,  //flight_number
    mission: 'Kepler Exploration X', //name
    rocket: 'Explorer IS1', //rocket.name
    launchDate: new Date('December 27, 2030'), //date_local
    target: 'Kepler-442 b', //not applicable
    customers: ['ZTM','NASA'], //payload.customers for each payload
    upcoming: true, //upcoming
    success: true, //success
};

saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
    console.log('Downloading launch data...');

    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
        pagination: false,
        populate: [
            {
                path: 'rocket',
                select: {
                    name: 1
                }
            },
            {
                path: 'payloads',
                select: {
                    customers: 1
                }
            }
        ]
    }
        
    })

    if(response.status !==200){
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch =  {
            flightNumber: launchDoc['flight_number'],  //flight_number
            mission: launchDoc['name'], //name
            rocket: launchDoc['rocket']['name'], //rocket.name
            launchDate: launchDoc['date_local'], //date_local
            target: 'Kepler-442 b', //not applicable
            customers, //payload.customers for each payload
            upcoming: launchDoc['upcoming'], //upcoming
            success: launchDoc['success'], //success
        }

        console.log(`${launch.flightNumber} ${launch.mission}`)
        await saveLaunch(launch);
        }

}
async function loadLaunchesData() {
    
    const firstLaunch = await findLaunch({
        flightNumber: 1,  //flight_number
        mission: 'FalconSat', //name
        rocket: 'Falcon 1', //rocket.name
    });
    if(firstLaunch){
        console.log('Launch data already loaded');
    } else {
        await populateLaunches();
    }

}

// console.log(launch.flightNumber);

// launches.set(launch.flightNumber, launch);
async function findLaunch(filter) {
    return await launchesDB.findOne(filter);
}
async function existLaunch(launchId) {
    return await findLaunch({
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
    .find({}, {'_id':0, '__v':0})
    .skip(20)
    .limit(50);
}

async function saveLaunch(launch) {
    await launchesDB.findOneAndUpdate(
        {flightNumber: launch.flightNumber,},
        launch,
        {upsert: true})
    }

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    })

    if (!planet){
        throw new Error('No matching planet was found!')
    }

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
    loadLaunchesData,
    getAllLaunches,
    scheduleNewLaunch,
    existLaunch,
    abortLaunchById,
};
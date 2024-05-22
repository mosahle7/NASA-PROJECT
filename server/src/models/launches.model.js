const { get } = require("../app");

const launches = new Map();

let latestFlightNumber = 100;
const launch = {
    flightNumber: latestFlightNumber,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM','NASA'],
    upcoming: true,
    success: true,
};

console.log(launch.flightNumber);

launches.set(launch.flightNumber, launch);

function existLaunch(launchId) {
    return launches.has(launchId);
}

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunches(launch) {
    latestFlightNumber+=1;
    launches.set(
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
    const aborted = launches.get(launchId);
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
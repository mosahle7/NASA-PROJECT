const {getAllLaunches, addNewLaunches, existLaunch, abortLaunchById} = require('../../models/launches.model');

function httpGetAllLaunches(req,res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunches(req,res) {
    const launch = req.body;

    if(!launch.mission || !launch.rocket || 
        !launch.launchDate || !launch.target) {
            return res.status(400).json({
                error: 'Missing required launch property',
            })
        }

    launch.launchDate = new Date(launch.launchDate);
     
    if (isNaN(launch.launchDate)){
        return res.status(400).json({
            error: 'Invalid launch date',
        })
    }
    addNewLaunches(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch(req,res) {
    const launchId = Number(req.params.id);

    if(existLaunch(launchId)){
        const aborted = abortLaunchById(launchId);
        return res.status(200).json(aborted);
    }
    else{
        return res.status(400).json({
            error: 'Launch not found!',
        })
    }


}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunch,
}
const {getAllLaunches, existLaunch, abortLaunchById, scheduleNewLaunch} = require('../../models/launches.model');

async function httpGetAllLaunches(req,res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunches(req,res) {
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
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req,res) {
    const launchId = Number(req.params.id);

    const existsLaunch = await existLaunch(launchId);
    if(existsLaunch){
        const aborted = await abortLaunchById(launchId);
        // return res.status(200).json(aborted);

        if(!aborted){
            return res.status(400).json({
                error: 'Launch not aborted!',
            })
        }
        return res.status(200).json({ 
            ok: true,
        })
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

const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');

const planets=require('./planets.mongo');


// const habitablePlanets = [];

const isHabitablePlanets = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
    && 0.36< planet['koi_insol'] && planet['koi_insol'] <1.11
    && planet['koi_prad'] < 1.6;
}

const parser = parse({ 
    comment: '#',
    columns: true,
})

function loadPlanetsData() {
return new Promise((resolve, reject) => {
    let count =0;

    fs.createReadStream(path.join(__dirname,'..','..','src','data','kepler_data.csv'))
    .pipe(parser)

    .on('data', async (data) => {
        if(isHabitablePlanets(data)){
            try
            { 
            await planets.updateOne(

            {keplerName: data.kepler_name}, 
            {keplerName: data.kepler_name},
            {upsert: true}
        );
        // if (updateResult.upsertedCount > 0) {
            count++;
        console.log(`Saved planet: ${data.kepler_name}`);
        // }
        } catch(err){
        console.error(`Could not save planet ${err}`)
        };
        }
        })
        
    .on('error', (err) => {
        console.log(err); 
        reject(err);
    })
    
    .on('end', async ()=> {
        // console.log(habitablePlanets.map((planet) => {
        //     return planet['kepler_name'] }))
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        // console.log('done')
        resolve();
    })
})
}
async function getAllPlanets() {
    return await planets.find({}, {
        '_id':0, 
        '__v':0,
    });
}

// async function savePlanet(planet) {
    
// }
module.exports = {
    loadPlanetsData,
    getAllPlanets,
}
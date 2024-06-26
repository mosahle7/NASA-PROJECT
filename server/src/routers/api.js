const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router')

const api = express.Router();

api.use('/planets',planetsRouter); //versioning
api.use('/launches', launchesRouter); //versioning

module.exports = api;
'use strict';
let express = require('express');
let router = express.Router();

let fixtureController = require('../controllers/fixtures');
let oddsController = require('../controllers/odds');
let teamController = require('../controllers/teams');
let leagueController = require('../controllers/leagues');
let bookieController = require('../controllers/bookies');
let dataFetch = require('../data/data-fetch');


// additional routes for admin

// fixtures
router.get('/fixtures', async (req, res) => {
    try {
        let fixtures = await fixtureController.list();
        res.status(200).send(fixtures);
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/fixtures/:id', async (req, res) => {
    try {
        let fixture = await fixtureController.getById(req.params.id);
        if (!fixture) {
            return res.status(404).send({ message: 'Fixture not found' });
        }
        res.status(200).send(fixture);
    } catch (error) {
        res.status(400).send(error);
    }
}),
router.post('/fixtures', fixtureController.bulkAdd);

// odds
router.post('/odds', oddsController.bulkAdd);
// teams
router.post('/teams', teamController.bulkAdd);
// leagues
router.post('/leagues', leagueController.bulkAdd);
// bookies
router.post('/bookies', bookieController.bulkAdd);

// manually fetch data
router.get('/fetch/fixtures', async (req, res) => {
    try {
        await dataFetch.fetchFixtures();
        res.status(200).send("Fixtures fetched");
    } catch(error) {
        res.status(400).send(error);
    }   
});
router.get('/fetch/odds', async (req, res) => {
    try {
        await dataFetch.fetchOdds();
        res.status(200).send("Odds fetched");
    } catch(error) {
        res.status(400).send(error);
    }   
});
router.get('/fetch/update', async (req, res) => {
    try {
        await dataFetch.updateFixtureStatus();
        res.status(200).send("Fixtures updated");
    } catch(error) {
        res.status(400).send(error);
    }   
});


module.exports = router;
const Fixture = require('../models/').Fixture;
const Odds = require('../models/').Odds;
const Team = require('../models/').Team;
const League = require('../models/').League;
const dataFetch = require('../data/data-fetch');


module.exports = {
    async list() {
        try {
            let fixtures = await Fixture.findAll({
                order: [['date', 'DESC']],
                include: [{
                    model: League
                }, {
                    model: Team,
                    as: 'homeTeam'
                }, {
                    model: Team,
                    as: 'awayTeam'
                }]
            });
            return fixtures;
            //return res.status(200).send(fixtures);
        } catch (error) {
            console.log(error);
        }
    },
    
    // add fixture: expects JSON object with a single instance of fixture
    /*
    {
        "idApi": 854617,
        "date": "2022-09-25T18:45:00+00:00",
        "status": "NS",
        "homeId": 43,
        "awayId": 3,
        "goalsHome": null,
        "goalsAway": null,
        "leagueId": 2,
        "watching": true
    }
    */
    async add(req, res) {
        try {
            let result = await dataFetch.addFixture(req.body);
            return res.status(200).send(result);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    async getById(id) {
        try {
            let fixture = await Fixture.findByPk(id, {
                include: [{
                    model: League
                }, {
                    model: Team,
                    as: 'homeTeam'
                }, {
                    model: Team,
                    as: 'awayTeam'
                }, {
                    model: Odds
                }]
            });
            return fixture;
        } catch (error) {
            console.log(error);
        }
    },
    async delete(req, res) {
        try {
            let fixture = await Fixture.findByPk(req.params.id);
            if (!fixture) {
                return res.status(404).send({ message: 'Fixture not found' });
            }
            await fixture.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}


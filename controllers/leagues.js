'use strict';
const League = require('../models/').League;

module.exports = {
    async list(req, res) {
        try {
            let leagues = await League.findAll();
            return res.status(200).send(leagues);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    // add league: expects array of objects (leagues) in API SPORTS format
    async bulkAdd(req, res) {
        try {
            let leaguesArray = [];
            await req.body.forEach(el => {
                leaguesArray.push({
                    idApi: el.league.id,
                    name: el.league.name,
                    logo: el.league.logo,
                    country: el.country.name,
                    flag: el.country.flag,
                    season: '2022'
                })
            })
            const result = await League.bulkCreate(leaguesArray);
            return res.status(200).send(result);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    async delete(req, res) {
        try {
            const league = await League.findByPk(req.params.id);
            if (!league) {
                return res.status(404).send({ message: 'League not found' });
            }
            await league.destroy();
            return res.status(204).send();
        } catch(error) {
            return res.status(400).send(error);
        }
    }
}
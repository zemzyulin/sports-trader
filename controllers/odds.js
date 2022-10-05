const Odds = require('../models/').Odds;
const dataFetch = require('../data/data-fetch');

module.exports = {
    async list(req, res) {
        try {
            let odds = await Odds.findAll();
            return res.status(200).send(odds);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    
    // add odds: expects JSON object with a single instance of odds
    /*
    {
        "moHome": 2.85,
        "moAway": 2.5,
        "moDraw": 3.25,
        "date": "2022-09-24T00:01:50.000Z",
        "fixtureId": 854617,
        "bookieId": 6
    }
    */
    async add(req, res) {
        try {
            let result = await dataFetch.addOdds(req.body);
            return res.status(200).send(result);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    async delete(req, res) {
        try {
            let odds = await Odds.findByPk(req.params.id);
            if (!odds) {
                return res.status(404).send({ message: 'Odds not found' });
            }
            await odds.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}
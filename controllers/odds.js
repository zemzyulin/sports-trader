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
    
    // add odds: expects array of JSON objects (instances of odds)
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
    async bulkAdd(req, res) {
        try {
            let oddsArray = req.body;
            let counter = 0;
            for (let i = 0; i < oddsArray.length; i++) {
                let element = await dataFetch.addOdds(oddsArray[i]);
                if (element) { counter++ }
            }
            res.status(200).send(`Odds added: ${counter}`)
        } catch (error) {
            res.status(400).send(error);
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
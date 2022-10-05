let express = require('express');
let router = express.Router();

let fixtureController = require('../controllers/fixtures');


// additional routes for admin
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
})

module.exports = router;
let express = require('express');
let router = express.Router();

let controller = require('../controllers/fixtures');

router.get('/', async (req, res) => {
    try {
        let results = await controller.list();
        let upcoming = results.filter(fixture => fixture.watching === true).sort((a, b) => a.date - b.date);
        let finished = results.filter(fixture => fixture.watching !== true);
        res.status(200).render('pages/dashboard', {
            upcoming: upcoming.splice(0, 10),
            finished: finished.splice(0, 10)
        });
    } catch (error) {
        res.status(400).send(error);
    }
});
router.post('/', controller.add);
router.get('/upcoming', async (req, res) => {
    try {
        let results = await controller.list();
        let upcoming = results.filter(fixture => fixture.watching === true).sort((a, b) => a.date - b.date);
        res.status(200).render('pages/upcoming', {
            upcoming: upcoming
        });
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/finished', async (req, res) => {
    try {
        let results = await controller.list();
        let finished = results.filter(fixture => fixture.watching !== true);
        res.status(200).render('pages/finished', {
            finished: finished
        });
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/:id', async (req, res) => {
    try {
        let fixture = await controller.getById(req.params.id);
        if (!fixture) {
            return res.status(404).send({ message: 'Fixture not found' });
        }
        
        // get unique dates
        let rawArray = fixture.Odds.map(el => el.date.getTime());
        let datesArray = rawArray.filter((v, i, a) => a.indexOf(v) === i).map(el => new Date(el));
        
        res.status(200).render('pages/fixture', {
            fixture: fixture,
            dates: datesArray
        })
    } catch (error) {
        console.log(error);
    }
});
router.delete('/:id', controller.delete);


module.exports = router;
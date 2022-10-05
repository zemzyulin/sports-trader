const Bookie = require('../models/').Bookie;

module.exports = {
    async list(req, res) {
        try {
            let bookies = await Bookie.findAll();
            return res.status(200).send(bookies);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    // add bookie: expects array of objects (teams) in API SPORTS format
    async add(req, res) {
        let bookiesArray = [];
        await req.body.forEach(bookie => {
                bookiesArray.push({
                    idApi: bookie.id,
                    name: bookie.name
                })
        });
        let result = await Bookie.bulkCreate(bookiesArray);
        return res.status(200).send(result);
    },
    async delete(req, res) {
        try {
            const bookie = await Bookie.findByPk(req.params.id);
            if (!team) {
                return res.status(404).send({ message: 'Bookie not found' });
            }
            await bookie.destroy();
            return res.status(204).send();
        } catch(error) {
            return res.status(400).send(error);
        }
    }
}
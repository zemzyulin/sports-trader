const Team = require('../models/').Team;

module.exports = {
    async list(req, res) {
        try {
            let teams = await Team.findAll();
            return res.status(200).send(teams);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    // add team: expects array of objects (teams) in API SPORTS format
    async bulkAdd(req, res) {
        try {
            // filter teams to remove duplicates
            let teamIds = [];
            let allTeams = await Team.findAll();
            await allTeams.forEach(team => teamIds.push(team.idApi));
            
            // add teams to db
            let teamsArray = [];
            await req.body.forEach(el => {
                if (!teamIds.includes(el.team.id)) {
                    teamsArray.push({
                        idApi: el.team.id,
                        name: el.team.name,
                        nameShort: el.team.name,
                        country: el.team.country,
                        logo: el.team.logo
                    });
                }
            })
            let result = await Team.bulkCreate(teamsArray);
            return res.status(200).send(result);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    async delete(req, res) {
        try {
            const team = await Team.findByPk(req.params.id);
            if (!team) {
                return res.status(404).send({ message: 'Team not found' });
            }
            await team.destroy();
            return res.status(204).send();
        } catch(error) {
            return res.status(400).send(error);
        }
    }
}
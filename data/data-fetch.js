'use strict';
const League = require('../models/').League;
const Team = require('../models/').Team;
const Fixture = require('../models/').Fixture;
const Odds = require('../models/').Odds;
const Bookie = require('../models/').Bookie;

const axios = require('axios');
const apiAccess = axios.create({
    method: 'get',
    baseURL: 'https://v3.football.api-sports.io',
    headers: {
        'x-rapidapi-key': process.env.API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
    }
});

module.exports = {
    // Fetches fixtures from API, normalizes and saves to DB
    async fetchFixtures(daysDeferred) {
        try {
            // 1. Get input data
            let season = 2022;
            let date = this.normalizeDate(new Date(), daysDeferred);
            let rawLeagues = await League.findAll();
            let leagueIds = await rawLeagues.map(el => el.dataValues.idApi);
            

            // 2. Fetch from API
            let rawArray = [];
            for (let i = 0; i < leagueIds.length; i++) {
                let query = await apiAccess(`/fixtures?league=${leagueIds[i]}&season=${season}&date=${date}`);
                let response = query.data.response;
                response.forEach(fixture => rawArray.push(fixture));
            }

            // 3. Normalize data
                // 3.1. Construct array of fixtures (objects)
                let fixturesArray = rawArray.map((fixture) => {
                    return {
                        idApi: fixture.fixture.id,
                        date: fixture.fixture.date,
                        status: fixture.fixture.status.short,
                        homeTeamId: fixture.teams.home.id, 
                        awayTeamId: fixture.teams.away.id, 
                        goalsHome: fixture.goals.home,
                        goalsAway: fixture.goals.away,
                        leagueId: fixture.league.id,
                        watching: true
                    }
                });
                // 3.2. Remap api IDs to local IDs
                for (let i = 0; i < fixturesArray.length; i++) {
                    let homeTeamId = await Team.findOne({ where: { idApi: fixturesArray[i].homeTeamId }})
                    let awayTeamId = await Team.findOne({ where: { idApi: fixturesArray[i].awayTeamId }})
                    let leagueId = await League.findOne({ where: { idApi: fixturesArray[i].leagueId }})
                    fixturesArray[i].homeTeamId = homeTeamId.dataValues.id;
                    fixturesArray[i].awayTeamId = awayTeamId.dataValues.id;
                    fixturesArray[i].leagueId = leagueId.dataValues.id;
                }
            
            // 4. Add data to DB
            let counter = 0;
            for (let i = 0; i < fixturesArray.length; i++) {
                let result = await this.addFixture(fixturesArray[i]);
                if (result) { counter++ }
            }
            console.log(`Fixtures successfully added: ${counter}`);
        } catch (error) {
            console.log(error);
        }
    },
    async addFixture(fixture) {
        try {
            let result = await Fixture.create(fixture);
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    // Fetches odds from API, normalizes and saves to DB
    async fetchOdds() {
        try {
            // 1. Get input data
            let rawFixtures = await Fixture.findAll({ where: { watching: true, status: "NS" }});
            let fixtureIds = await rawFixtures.map(el => el.dataValues.idApi);
            let bookies = await Bookie.findAll();
            const validBookies = bookies.map(bookie => bookie.idApi);
            
            // ***1.1. Additional filter to comply with "10 queries / min" limit
            for (let i = 0; i < rawFixtures.length; i++) {
                // *** Additional filter to comply with 10 queries / min limit
                let rawArray = await Odds.findAll({ where: { fixtureId: rawFixtures[i].dataValues.id }});
                let oddsArray = rawArray.filter(element => {
                    if (this.normalizeDate(element.dataValues.date) === this.normalizeDate(new Date())) {
                        return element.dataValues;
                    }
                })
                //let date = this.normalizeDate(new Date(), daysDeferred);
                if (oddsArray.length > 0) {
                    fixtureIds.splice(fixtureIds.indexOf(rawFixtures[i].dataValues.idApi), 1);
                }
            }
            
            // 2. Fetch from API and normalize
            let fullArray = [];
            for (let i = 0; i < fixtureIds.length; i++) {
                // 2.1. Fetch odds
                let query = await apiAccess(`/odds?fixture=${fixtureIds[i]}`);
                let response = query.data;

                if (response.results !== 0) {
                    // 2.2. Normalize odds
                    // 2.2.1. Filter bookies
                    let rawArray = response.response[0].bookmakers.filter(bookie => {
                        if (validBookies.includes(bookie.id)) {
                            return bookie;
                        }
                    });
                    // 2.2.2. Normalize data
                    let fixture = await Fixture.findOne({ where: { idApi: fixtureIds[i] }})
                    let date = response.response[0].update;
                    let oddsArray = [];
                    rawArray.forEach(el => {
                        oddsArray.push({
                            moHome: el.bets[0].values[0].odd,
                            moAway: el.bets[0].values[2].odd,
                            moDraw: el.bets[0].values[1].odd,
                            date: date,
                            bookieId: el.id,
                            fixtureId: fixture.dataValues.id
                        })
                    });
                    // 2.2.3. Remap bookie IDs
                    let bookie;
                    for (let i = 0; i < oddsArray.length; i++) {
                        bookie = await Bookie.findOne({ where: { idApi: oddsArray[i].bookieId }});
                        oddsArray[i].bookieId = bookie.dataValues.id;
                    }
                    fullArray.push(oddsArray);
                }
            }
            // 3. Add data to DB
            let counter = 0;
            for (let i = 0; i < fullArray.length; i++) {
                for (let j = 0; j < fullArray[i].length; j++) {
                    let check = await this.addOdds(fullArray[i][j]);
                    if (check) { counter++ }
                }
            }
            console.log(`Odds successfully added: ${counter}`);
        } catch (error) {
            console.log(error);
        }
    },
    async addOdds(odds) {
        try {
            let result = await Odds.create(odds);
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    // Checks if match has started; updates its scores and status
    async updateFixtureStatus() {
        // 1. Set input data
        let timestamp = new Date();
        let timeNow = timestamp.getTime();
        let counter = 0;
        
        // 2. Filter fixtures by time, and update status
        let rawArray = await Fixture.findAll({ where: { watching: true }});
        for(let i = 0; i < rawArray.length; i++) {
            if (timeNow > rawArray[i].dataValues.date.getTime()) {
                // fetch fixture status
                let query = await apiAccess(`/fixtures?id=${rawArray[i].dataValues.idApi}`);
                let response = query.data.response[0];
                let status = response.fixture.status.short;
                counter++
                if (status === 'FT' || status === 'AET' || status === 'PEN') {
                    // match finished: update score; unwatch
                    let fixture = rawArray[i];
                    fixture.update({
                        status: 'FT',
                        goalsHome: response.goals.home,
                        goalsAway: response.goals.away,
                        watching: false
                    })
                } else if (timeNow - rawArray[i].dataValues.date.getTime() > 12180000) {
                    // match cancelled: update score; unwatch
                    let fixture = rawArray[i];
                    fixture.update({
                        status: 'CANC',
                        goalsHome: response.goals.home,
                        goalsAway: response.goals.away,
                        watching: false
                    })
                } else {
                    // match live: update score; keep watching
                    let fixture = rawArray[i];
                    fixture.update({
                        status: 'LIVE',
                        goalsHome: response.goals.home,
                        goalsAway: response.goals.away,
                        watching: true
                    })
                }
            }
        }
        console.log(`Fixtures updated: ${counter}`);
    },

    // helper functions

    normalizeDate(date, daysDeferred = 0) {
        let newDate = date;
        newDate.setDate(date.getDate() + daysDeferred);
    
        let year = (newDate.getUTCFullYear()).toString();
        let month = (newDate.getUTCMonth() + 1).toString();
        let day = newDate.getUTCDate().toString();
        month.length < 2 ? month = '0' + month : month;
        day.length < 2 ? day = '0' + day : day;

        return `${year}-${month}-${day}`;
    }
}
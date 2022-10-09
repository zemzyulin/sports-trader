'use strict';
const cron = require('node-cron');
const dataFetch = require('./data-fetch');

// TASK 1: Get fixtures on Date.now + 7 days and save them to DB
// Execute every day at 03:00 UTC
function task1() {
    cron.schedule('0 3 * * *', () => {
        console.log('Fetching fixtures... ');
        dataFetch.fetchFixtures(6);
    }, {
        timezone: 'UTC'
    })
}

// TASK 2: Get odds for every upcoming fixture and save them to DB
// Execute every day at 03:30, 10:30 and 16:30 UTC
function task2() {
    cron.schedule('30 3,10,16 * * *', () => {
        console.log('Fetching odds... ');
        dataFetch.fetchOdds();
    }, {
        timezone: 'UTC'
    })
}

// TASK 3: Update fixtures staus: from upcoming to finished
// Execute every day, every 30 minutes
function task3() {
    cron.schedule('5,35 * * * *', () => {
        console.log('Checking starting times... ');
        dataFetch.updateFixtureStatus();
    }, {
        timezone: 'UTC'
    })
}

module.exports = { task1, task2, task3 }
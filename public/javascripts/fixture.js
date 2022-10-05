
highlightOdds();
changeStatus();
renderChart();


// 1. Highlight best current odds
async function highlightOdds() {
    try {
        // 1.1. Home odds
        let currentHomeOdds = [];
        document.querySelectorAll(".curr-home").forEach(el => currentHomeOdds.push(el));
        currentHomeOdds.sort((a,b) => b.innerHTML - a.innerHTML);
        if (currentHomeOdds[0]) {
            let element = document.getElementById(`${currentHomeOdds[0].id}`);
            element.style.backgroundColor = "#34ad75";
            element.style.fontWeight = "bold";
        }

        // 1.2. Draw odds
        let currentDrawOdds = [];
        document.querySelectorAll(".curr-draw").forEach(el => currentDrawOdds.push(el));
        currentDrawOdds.sort((a,b) => b.innerHTML - a.innerHTML);
        if (currentDrawOdds[0]) {
            let element = document.getElementById(`${currentDrawOdds[0].id}`);
            element.style.backgroundColor = "#34ad75";
            element.style.fontWeight = "bold";
        }

        // 1.3. Away odds
        let currentAwayOdds = [];
        document.querySelectorAll(".curr-away").forEach(el => currentAwayOdds.push(el));
        currentAwayOdds.sort((a,b) => b.innerHTML - a.innerHTML);
        if (currentAwayOdds[0]) {
            let element = document.getElementById(`${currentAwayOdds[0].id}`);
            element.style.backgroundColor = "#34ad75";
            element.style.fontWeight = "bold";
        }
    } catch(error) {
        console.log(error);
    }
}

// 2. Change status
async function changeStatus() {
    try {
        const matchStatus = document.getElementById("match-status").innerHTML;
        switch (matchStatus) {
            case "FT":
                document.getElementById("match-status").innerHTML = "Full Time";
                document.getElementById("current-odds").innerHTML = "Pre-match odds";
                break;
            case "LIVE":
                document.getElementById("match-status").innerHTML = "Match is live";
                document.getElementById("current-odds").innerHTML = "Pre-match odds";
                break;
            default:
                document.getElementById("match-status").innerHTML = "Match not started";
                document.getElementById("goalsHome").innerHTML = "-";
                document.getElementById("goalsAway").innerHTML = "-";
        }
    } catch (error) {
        console.log(error);
    }
}

// 3. Render chart
async function renderChart() {
    try {
        const labels = [];
        document.querySelectorAll(".date").forEach(el => labels.push(el.innerHTML));

        const data = {
            labels: labels,
            datasets: [{
                label: 'bwin',
                backgroundColor: '#2e2b28',
                borderColor: '#2e2b28',
                data: [],
            }, {
                label: 'William Hill',
                backgroundColor: '#4421af',
                borderColor: '#4421af',
                data: [],
            }, {
                label: 'bet365',
                backgroundColor: '#027b5b',
                borderColor: '#027b5b',
                data: [],
            }, {
                label: 'Marathon',
                backgroundColor: '#b30000',
                borderColor: '#b30000',
                data: [],
            }, {
                label: 'Pinnacle',
                backgroundColor: '#ffa300',
                borderColor: '#ffa300',
                data: [],
            }, {
                label: 'SBO',
                backgroundColor: '#b3d4ff',
                borderColor: '#b3d4ff',
                data: []
            }]
        };

        for (let i = 1; i < data.datasets.length + 1; i++) {
            document.querySelectorAll(`.home${i}`).forEach(el => data.datasets[i - 1].data.push(el.innerHTML));    
        }

        const config = {
            type: 'line',
            data: data,
            options: {}
        };

        const myChart = new Chart(
            document.getElementById('lineChart'),
            config
        )
    } catch (error) {
        console.log(error);
    }
}



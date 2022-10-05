const upcomingButton = document.getElementById("upcoming");
if (upcomingButton) {
    upcomingButton.addEventListener("click", () => {
        location.href = "fixtures/upcoming"
    })
}

const finishedButton = document.getElementById("finished");
if (finishedButton) {
    finishedButton.addEventListener("click", () => {
        location.href = "fixtures/finished"
    })
}

document.querySelectorAll(".table-button").forEach(el => {
    el.addEventListener("click", () => {
        location.href = "/fixtures/" + el.id
    })
})
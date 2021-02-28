const voteButtons = document.querySelector("#voteButtons");
const rightButton = document.querySelector(".right");
const wrongButton = document.querySelector(".wrong");
const greenBar = document.querySelector(".green");
const redBar = document.querySelector(".red");

var rightVotes = 0;
var wrongVotes = 0;

rightButton.addEventListener("click", () => {
    rightVotes++;
    updateVoteBar();
});

wrongButton.addEventListener("click", () => {
    wrongVotes++;
    updateVoteBar();
});

function updateVoteBar() {
    // Hide buttons once voted, disabled for testing
    // voteButtons.classList.add("hidden");
    // TODO: Add socketio functionality :)
    // * When adding socketio, do percentage calculations serverside
    var totalVotes = wrongVotes + rightVotes;
    var rightPercentage = Math.round(rightVotes/totalVotes*100);
    var wrongPercentage = Math.round(wrongVotes/totalVotes*100);
    greenBar.textContent = rightPercentage + "%";
    redBar.textContent = wrongPercentage + "%";
    greenBar.style.borderRadius = (rightPercentage === 100) ? "5px" : "";
    redBar.style.borderRadius = (wrongPercentage === 100) ? "5px" : "";
    greenBar.style.flex = rightPercentage;
    redBar.style.flex = wrongPercentage;
}
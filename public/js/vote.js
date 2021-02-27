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
    if (rightPercentage === 100) {
        greenBar.style.borderRadius = "5px";
    } else {
        greenBar.style.borderRadius = "";
    }
    if (wrongPercentage === 100) {
        redBar.style.borderRadius = "5px";
    } else {
        redBar.style.borderRadius = "";
    }
    if (rightPercentage === 0) {
        greenBar.textContent = "";
    }
    if (wrongPercentage === 0) {
        redBar.textContent = "";
    }
    greenBar.style.flex = rightPercentage;
    redBar.style.flex = wrongPercentage;
    console.log(`Right: ${rightPercentage}% Wrong: ${wrongPercentage}%`);
}
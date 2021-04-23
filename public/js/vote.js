const voteButtons = document.querySelector("#voteButtons");
const rightButton = document.querySelector(".right");
const wrongButton = document.querySelector(".wrong");
const voteBar = document.querySelector(".votebar");
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
    voteButtons.classList.add("hidden");
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

    voteBar.classList.remove("hidden");
}
// TODO: Do this manually for better alignment, and possibly better smoothing (ease)
//wrongButton.scrollIntoView({ behavior: 'smooth', block: 'end'});

// Stolen from https://stackoverflow.com/a/39494245/7325232
function doScrolling(elementY, duration) {
    var startingY = window.pageYOffset;
    var diff = elementY - startingY;
    // Easing function: easeInOutQuad
    // From: https://gist.github.com/gre/1650294
    var easing = function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t }
    var start;

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        // Elapsed milliseconds since start of scrolling.
        var time = timestamp - start;
        // Get percent of completion in range [0, 1].
        var percent = Math.min(time / duration, 1);
        percent = easing(percent)

        window.scrollTo(0, startingY + diff * percent);

        // Proceed with animation as long as we wanted it to.
        if (time < duration) {
            window.requestAnimationFrame(step);
        }
    })
}

// Y: 140 is Nice positioning
doScrolling(140, 1000);
// TODO: Fill with data from server

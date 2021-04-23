//  ? This could technically be converted to a class, but whatever. Lets make it work first

const socket = io();

const nameDiv = document.querySelector(".name");
const lobbyDiv = document.querySelector(".lobby");
const drawDiv = document.querySelector(".draw");
const waitingDiv = document.querySelector(".waiting");
const guessDiv = document.querySelector(".guess");
const voteDiv = document.querySelector(".vote");
const drawWord = document.querySelector(".word");

const linkDiv = document.querySelector(".link");
const link = window.location.href.replace(/(http:\/\/)|(https:\/\/)/g, "");
const code = link.slice(-4);
const tooltiptext = document.querySelector(".tooltiptext");
const startButton = document.querySelector("#startButton");
var linkText = document.createElement("p");
linkText.textContent = link;

linkDiv.insertBefore(linkText, tooltiptext);

linkDiv.addEventListener("click", copyLink);

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    // Tooltip to confirm copy
    tooltiptext.style.opacity = 1;
    // Set the opacity to 0 after 5 seconds
    setTimeout(() => {tooltiptext.style.opacity = 0;}, 5000);
}

const nameInput = document.querySelector("#nameInput");
const confirmButton = document.querySelector("#nameConfirm");

nameInput.addEventListener("input", () => {
    validateUserName(nameInput.value)
});

confirmButton.addEventListener("click", () => {
    if (nameInput.value) {
        joinGame();
    }
});

document.addEventListener("keydown", checkEnter);

startButton.addEventListener("click", () => {
    if (!startButton.classList.contains("disabled")) {
        socket.emit("startGame");
    }
});

// When host refreshes, send to home with error
socket.emit("checkID", code);

function validateUserName(name) {
    // ? Maybe sanitize with RegEx if needed? "/([A-z])/g"
    if (name.length === 0) {
        // Disable confirm button
        confirmButton.classList.add("disabled");
    } else {
        confirmButton.classList.remove("disabled");
    }
}

function checkEnter(e) {
    if (nameInput.value) {
        if (e.key === "Enter") {
            joinGame();
        }
    }
}

function joinGame() {
    changeScreen(nameDiv, lobbyDiv);

    // Disable this eventListener as it's no longer of use
    document.removeEventListener("keydown", checkEnter);

    // Warn on refresh/leave
    // ? Do we do this?
    // window.addEventListener("beforeunload", (e) => {
    //     e.preventDefault();
    //     e.returnValue = "";
    // });

    socket.emit("join", code, nameInput.value);
}

function changeScreen(oldScreen, newScreen) {
    oldScreen.classList.add("hidden");
    newScreen.classList.remove("hidden");
    // TODO: Finish adding ENTER support for guess screen
    // if (newScreen === guessDiv) {
    //     document.addEventListener("keydown", )
    // }
}

socket.on("updateClientList", (clients) => {
    const playerList = document.querySelector('.players');
    playerList.innerHTML = "";
    clients.forEach((player) => {
        var playerDiv = document.createElement("div");
        playerDiv.className = "player";
        playerDiv.textContent = player.name;
        playerList.appendChild(playerDiv);
        // TODO: Render leader in a better way than this. 👀 https://fontawesome.com/
        if (player.isHost) {
            var icon = document.createElement("div");
            icon.className = "icon";
            icon.textContent = "👑";
            playerDiv.appendChild(icon);
        }
        if (player.id === socket.id && player.isHost) {
            startButton.classList.remove("hidden");
        }
    });
    if (document.querySelectorAll(".player").length > 3) {
        startButton.classList.remove("disabled");
    } else {
        startButton.classList.add("disabled");
    }
    // Dev lobby
    if (code === "7777") {
        startButton.classList.remove("disabled");
    }
});

// Temporary fix for not being able to reconnect, at least in lobby
socket.on("error", (error) => {
    if(error === "invalid") {
        window.location.replace(window.location.href.slice(0, -4) + "?invalid=" + code);
    }
    if(error === "started") {
        window.location.replace(window.location.href.slice(0, -4) + "?started=" + code);
    }
});

socket.on("gameStart", (firstWord) => {
    drawWord.textContent = firstWord;
    changeScreen(lobbyDiv, drawDiv);
});

socket.on("newWord", (word) => {
    drawWord.textContent = word;
    changeScreen(waitingDiv, drawDiv);
})

//
// draw.js
//

const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
var drawing = false;
var erase = false;
const eraseButton = document.querySelector("#eraseButton");
const resetButton = document.querySelector("#resetButton");
const drawingSubmitButton = document.querySelector("#drawingSubmitButton");

canvas.height = 500;
canvas.width = 500;

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;
    ctx.lineCap = "round";
    var posX = e.offsetX;
    var posY = e.offsetY;

    ctx.lineTo(posX, posY);
    if (erase) {
        ctx.lineWidth = 15;
        ctx.globalCompositeOperation="destination-out";
    } else {
        ctx.lineWidth = 5;
        ctx.globalCompositeOperation="source-over";
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(posX, posY);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseout", stopDrawing);

eraseButton.addEventListener("click", () => {
    erase = !erase;
    eraseButton.textContent = erase ? "Tegne" : "Viskelær";
});

resetButton.addEventListener("click", clearCanvas);

drawingSubmitButton.addEventListener("click", submitDrawing);

function submitDrawing() {
    const canvas = document.querySelector("#drawCanvas");
    const dataURL = canvas.toDataURL();
    socket.emit("submitDrawing", dataURL);
    changeScreen(drawDiv, waitingDiv);
    clearCanvas();
}

//
// Waiting screen
//

const waitingPlayers = document.querySelector("#waitingPlayers");

socket.on("updateWaiting", (waiting) => {
    waitingPlayers.innerHTML = "";
    waiting.forEach((player) => {
        var playerDiv = document.createElement("div");
        playerDiv.className = "player";
        playerDiv.textContent = player.name;
        waitingPlayers.appendChild(playerDiv);
    });
});

//
// Guess screen
//

const drawingImg = document.querySelector("#drawingImg");
const guessButton = document.querySelector("#guessButton");
const guessInput = document.querySelector("#guessInput");

socket.on("newDrawing", (dataURL) => {
    drawingImg.src = dataURL;
    changeScreen(waitingDiv, guessDiv);
});

guessInput.addEventListener("input", () => {
    guessInput.value.length > 0 ? guessButton.classList.remove("disabled") : guessButton.classList.add("disabled");
});

guessButton.addEventListener("click", () => {
    var guess = guessInput.value;
    socket.emit("submitGuess", guess);
    changeScreen(guessDiv, waitingDiv);
    guessInput.value = "";
});


//
// Voting/results screen
//

socket.on("voteStart", () => {
    changeScreen(waitingDiv, voteDiv);
});

socket.on("showVote", (data) => {
    // TODO: Fill with data from server

    // Populate voting screen
    console.log(data);
    //* For reference
    // data:
    // owner: string
    // startWord: string
    // parts: array of parts, 1 being first drawing
    // each part has an owner, type and data. "type" is either WORD or DRAWING
});

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
    socket.emit("vote", "right")
});

wrongButton.addEventListener("click", () => {
    wrongVotes++;
    updateVoteBar();
    socket.emit("vote", "wrong");
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

////wrongButton.scrollIntoView({ behavior: 'smooth', block: 'end'});

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
        percent = easing(percent);

        window.scrollTo(0, startingY + diff * percent);

        // Proceed with animation as long as we wanted it to.
        if (time < duration) {
            window.requestAnimationFrame(step);
        }
    })
}

// Y: 140 is Nice positioning
doScrolling(140, 1000);

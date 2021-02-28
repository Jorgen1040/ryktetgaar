//  ? This could technically be converted to a class, but whatever. Lets make it work first

const socket = io();

const nameDiv = document.querySelector(".name");
const lobbyDiv = document.querySelector(".lobby");
const drawDiv = document.querySelector(".draw");
const waitingDiv = document.querySelector(".waiting");
const guessDiv = document.querySelector(".guess");
const voteDiv = document.querySelector(".vote");

const linkDiv = document.querySelector(".link");
const link = window.location.href.replace(/(http:\/\/)|(https:\/\/)/g, "");
const code = link.slice(-4);
const tooltiptext = document.querySelector(".tooltiptext");
const startButton = document.querySelector("#startButton");
var linkText = document.createElement("p");
linkText.textContent = link;

linkDiv.insertBefore(linkText, tooltiptext);

linkDiv.addEventListener("click", () => {
    copyLink();
});

function copyLink() {
    const copyText = document.querySelector(".link p");
    const range = document.createRange();
    const tooltiptext = document.querySelector(".tooltiptext");

    window.getSelection().removeAllRanges();
    range.selectNode(copyText);
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    // Tooltip to confirm copy
    tooltiptext.style.opacity = 1;
    setTimeout(() => {tooltiptext.style.opacity = 0;}, 5000)

}

const nameInput = document.querySelector("#nameInput");
const confirmButton = document.querySelector("#nameConfirm");

nameInput.addEventListener("input", () => {
    validateUserName(nameInput.value)
});

confirmButton.addEventListener("click", () => {
    if (nameInput.value) {
        joinGame(code, nameInput.value);
    }
});

document.addEventListener("keydown", (e) => {
    if (nameInput.value) {
        if (e.key === "Enter") {
            joinGame(code, nameInput.value);
        }
    }
});

startButton.addEventListener("click", () => {
    if (!startButton.classList.contains("disabled")) {
        socket.emit("startGame");
    }
});

// * This is a prevention to stop players from getting disconnected when reloading, but also happens on meaning to leave game. Kind of annoying
// TODO: Run this after game starts
// window.addEventListener("beforeunload", (e) => {
//     e.preventDefault();
//     e.returnValue = "";
// });

// When host refreshes, send to home with error
socket.emit("checkID", code);

function validateUserName(name) {
    // ? Maybe sanitize with RegEx if needed? "/([A-z])/g"
    if (name.length === 0) {
        // Disable confirm button
        confirmButton.classList.add("disabled")
    } else {
        confirmButton.classList.remove("disabled")
    }
}

// TODO: Add start game function
function joinGame(id, name) {
    changeScreen(nameDiv, lobbyDiv);
    socket.emit("join", id, name);
}

function changeScreen(oldScreen, newScreen) {
    oldScreen.classList.add("hidden");
    newScreen.classList.remove("hidden");
}

socket.on("updateClientList", (clients) => {
    //if (clients.length === 0) window.location.replace(window.location.href.slice(0, -4) + "?error=" + code);
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
            startButton.classList.remove("hidden")
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
    console.log(firstWord);
    changeScreen(lobbyDiv, drawDiv);
    document.querySelector(".word").textContent = firstWord;
});

//
// draw.js
//

const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
var drawing = false;
var erase = false;
const eraseButton = document.querySelector("#eraseButton");
const resetButton = document.querySelector("#resetButton");

canvas.height = 500;
canvas.width = 500;

function startDrawing(e){
    drawing = true;
    draw(e);
}

function stopDrawing(){
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

resetButton.addEventListener("click", () => {
    clearCanvas();
});

document.querySelector("#submitButton").addEventListener("click", () => {
    submitDrawing();
});

function submitDrawing(){
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


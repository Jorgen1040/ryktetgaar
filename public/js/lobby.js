//  ? This could technically be converted to a class, but whatever. Lets make it work first

const socket = io();
const linkDiv = document.querySelector(".link");
const link = window.location.href.replace(/(http:\/\/)|(https:\/\/)/g, "");
const code = link.slice(-4);
const tooltiptext = document.querySelector(".tooltiptext");
var linkText = document.createElement("p");
linkText.textContent = link;

linkDiv.insertBefore(linkText, tooltiptext);

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
    joinGame(code, nameInput.value)
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        joinGame(code, nameInput.value);
    }
});


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
    document.querySelector(".name").classList.add("hidden");
    document.querySelector(".lobby").classList.remove("hidden");
    socket.emit("join", id, name);
}

socket.on("updateClientList", (clients) => {
    const playerList = document.querySelector('.players');
    playerList.innerHTML = "";
    clients.forEach((player) => {
        // TODO: Render leader in a better way than this
        if (player.isHost) {
            playerName = "👑" + player.name;
        } else {
            playerName = player.name;
        }
        var player = document.createElement("div");
        player.className = "player";
        player.textContent = playerName;
        playerList.appendChild(player);
    });
});

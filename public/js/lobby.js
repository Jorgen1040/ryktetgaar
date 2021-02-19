const socket = io();
window.onload = () => {
    const linkDiv = document.querySelector(".link");
    const link = window.location.href.replace(/(http:\/\/)|(https:\/\/)/g, "");
    const tooltiptext = document.querySelector(".tooltiptext");
    var linkText = document.createElement("p");
    linkText.textContent = link;

    linkDiv.insertBefore(linkText, tooltiptext);
}

function copyLink() {
    const copyText = document.querySelector(".link");
    const range = document.createRange();
    const tooltiptext = document.querySelector(".tooltiptext");

    window.getSelection().removeAllRanges();
    range.selectNode(copyText);
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    // Add tooltip to confirm link is copied
    // "Kopiert til utklippstavle"
    // TODO: Tooltip
    tooltiptext.style.opacity = 1;
    setTimeout(() => {tooltiptext.style.opacity = 0;}, 5000)

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
        console.log(player.name);
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

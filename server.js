const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const nanoid = require("nanoid");

const fs = require("fs");
const Game = require("./server/game");
const Client = require("./server/client");

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const io = socketIO(server);

const publicPath = path.join(__dirname, "public");

// Use customAlphabet to make a 4 character room ID generator
const nano = nanoid.customAlphabet("abcdefghijklmnopqrstuvwxyz", 4);

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(publicPath));

var games = {};

io.on("connection", (socket) => {
    socket.on("join", (id, name) => {
        if (name.length === 0 || name.length > 12) {
            return;
        }
        if (games[id]) {
                const newClient = new Client(name, socket);
                games[id].addClient(newClient);
                games[id].updateClientList(io);
        } else {
            // For when a single host refreshes
            socket.emit("error");
        }
    });
});

app.get('/favicon.ico', (req, res) => res.status(204)); // TODO: Add a favicon, so i dont have to do this

app.get("/", (req, res) => {
    if (req.query.error) {
        return res.render("index", { error: req.query.error });
    }
    res.render("index");
});

app.get("/new", (req, res) => {
    let gameID = nano()
    games[gameID] = new Game(gameID, (id) => {
        delete games[id];
    });
    res.redirect('/' + gameID);
});


app.get("/draw", (req, res) => {
    res.render("draw");
});

app.get("/start", (req, res) => {
    res.send("Funker ikke enda :)")
});

app.get("/:id", (req, res) => {
    let id = req.params.id;
    if (games[id]) {
            // TODO: Fix issue when reloading, not deleting room quick enough
            return res.render("lobby", { roomID: id });
    }
    res.redirect("/?error=" + id);
});

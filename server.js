const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const nano = require("nanoid");

const fs = require("fs");
const Game = require("./server/game");
const Client = require("./server/client");

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const io = socketIO(server);

const publicPath = path.join(__dirname, "public");

const nanoid = nano.customAlphabet("abcdefghijklmnopqrstuvwxyz", 4);

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(publicPath));

// Socket IO testing ground
var games = [];

io.on("connection", (socket) => {
    //console.log(`user connected ${socket.id}`);
    socket.on("join", (id, name) => {
        for (i=0; i < games.length; i++) {
            if (games[i].id === id){
                const newClient = new Client(name, socket);
                games[i].addClient(newClient);
                games[i].updateClientList(io);
                return
            }
        }
        console.log("error") // ! Make this display error message (Lobby not found)
    })
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/new", (req, res) => {
    const newGame = new Game(nanoid(), (id) => {
        for (i=0; i < games.length; i++) {
            if (games[i].id === id){
                games.splice(i, 1);
            }
        }
    });
    games.push(newGame);
    res.redirect('/' + newGame.id);
});

app.get("/draw", (req, res) => {
    res.render("draw");
});

app.get("/start", (req, res) => {
    res.send("Funker ikke enda :)")
})

app.get("/:id", (req, res) => {
    // TODO: Add check for invalid IDs and non existing rooms, give error
    res.render("lobby", { roomID: req.params.id});
});

// ? This might be obsolete, use socket.emit instead
app.post("/send", (req, res) => {
    // TODO: Make this update a MongoDB or something idk (local or at least self hosted)
    var body = "";
    filePath = __dirname + "/data/data.json";
    console.log(req.body);
    req.on("data", function (data) {
        body += data;
    });

    req.on("end", function () {
        fs.appendFile(filePath, body, function () {
            res.send("ok");
        });
    });
});

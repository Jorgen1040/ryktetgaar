const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const nanoid = require("nanoid");
const helmet = require("helmet");
const morgan = require("morgan");
const crypto = require("crypto");

const Game = require("./server/game");
const Client = require("./server/client");
const Words = require("./server/words");
var games = {};

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const io = socketIO(server);

const publicPath = path.join(__dirname, "public");

// Use customAlphabet to make a 4 character room ID generator
const nano = nanoid.customAlphabet("abcdefghijklmnopqrstuvwxyz", 4);

app.use(express.json());

// Security stuff
app.use((req, res, next) => {
    // Generate Nonce to validate scripts
    res.locals.nonce = crypto.randomBytes(16).toString("hex");
    next();
});
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`, "https://www.googletagmanager.com"],
            connectSrc: ["'self'", "https://www.google-analytics.com"],
        },
    }
}));

process.env.NODE_ENV = process.env.NODE_ENV || "development"

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
    games["ffff"] = new Game("ffff", io, () => {
        console.log("onEmpty triggered, but game is dev");
        games["ffff"].started = false;
    });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    // Checks the ID, runs on lobby screen refresh
    socket.on("checkID", (id) => {
        if (!games[id]) {
            socket.emit("error", "invalid");
        }
    });
    socket.on("join", (id, name) => {
        // TODO: Check if someone sends wrong data
        if (name.length === 0 || name.length > 12) {
            return;
        }
        if (games[id]) {
            if (games[id].started) {
                return socket.emit("error", "started");
            }
            const newClient = new Client(name, socket);
            games[id].addClient(newClient);
        } else {
            // Send error if game doesn't exist
            socket.emit("error", "invalid");
        }
    });
});

app.get('/favicon.ico', (req, res) => res.status(204).end()); // TODO: Add a favicon, so i dont have to do this

app.get("/", (req, res) => {
    if (req.query.nonexistant) {
        return res.render("index", { nonexistant: req.query.nonexistant });
    }
    if (req.query.invalid) {
        return res.render("index", { invalid: req.query.invalid });
    }
    if (req.query.started) {
        return res.render("index", { started: req.query.started });
    }
    res.render("index");
});

app.get("/new", (req, res) => {
    let gameID;
    // Generate game ID and make sure it's not overlapping with existing games or default paths
    do {
        gameID = nano();
    } while (gameID.match(/^(draw|vote|join)$/) || games[gameID]);
    console.log("Creating game with ID: " + gameID);
    games[gameID] = new Game(gameID, io, () => {
        // This runs onEmpty
        console.log("Removing game with ID: " + gameID);
        delete games[gameID];
    });
    res.redirect('/' + gameID);
});


app.get("/draw", (req, res) => {
    res.render("draw");
});

app.get("/vote", (req, res) => {
    res.render("vote");
});

app.get("/join", (req, res) => {
    res.render("join");
});

app.get("/:id", (req, res) => {
    let id = req.params.id;
    // Return error if code is invalid
    if (!id.match(/^[a-z]{4}$/)) {
        return res.redirect("/?invalid=" + id);
    }
    if (games[id]) {
        if (games[id].started) {
            return res.redirect("/?started=" + id);
        }
        return res.render("lobby", { roomID: id });
    }
    res.redirect("/?nonexistant=" + id);
});

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
    //console.log(res.locals.cspNonce);
    next();
});
app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`, "https://www.googletagmanager.com"],
        connectSrc: ["'self'", "https://www.google-analytics.com"],
    },
}));

process.env.NODE_ENV = process.env.NODE_ENV || "development"

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
    games["7777"] = new Game("7777", io, () => {
        games["7777"].started = false;
        console.log("onEmpty triggered, but game is dev");
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
    if (req.query.invalid) {
        return res.render("index", { invalid: req.query.invalid });
    }
    if (req.query.started) {
        return res.render("index", { started: req.query.started });
    }
    res.render("index");
});

app.get("/new", (req, res) => {
    let gameID = nano()
    games[gameID] = new Game(gameID, io, (id) => {
        // This runs onEmpty
        delete games[id];
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
    if (games[id]) {
        if (games[id].started) {
            return res.redirect("/?started=" + id);
        }
        return res.render("lobby", { roomID: id });
    }
    res.redirect("/?invalid=" + id);
});

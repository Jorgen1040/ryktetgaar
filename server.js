const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const nano = require('nanoid');

const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, "public");

const nanoid = nano.customAlphabet("abcdefghijklmnopqrstuvwxyz", 4)

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/lobby', (req, res) => {
    res.render('lobby');
});

app.get('/new', (req, res) => {
    // Generate game ID and send them to the lobby
    // Open socket.io connection and serve the correct lobby based on nanoid
    res.send('New game waow' + nanoid());
});

app.get('/draw', (req, res) => {
    res.render('draw');
});

app.get('/:id', (req, res) => {
    // Redirect to lobby, check if invite link is invalid
    res.send(req.params);
});

app.post('/send', (req, res) => {
    // TODO: Make this update a MongoDB or something idk (local or at least self hosted)
    var body = '';
    filePath = __dirname + '/data/data.json';
    console.log(req.body);
    req.on('data', function(data) {
        body += data;
    });

    req.on('end', function(){
        fs.appendFile(filePath, body, function() {
            res.send("ok");
        });
    });
});

app.get('getDrawing', (req, res) => {
    // Get drawing from data.json and display for user

});

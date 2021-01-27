import express, { json as _json, static } from 'express';
import { join } from 'path';
import { createServer } from 'http';
import socketIO from 'socket.io';
import { customAlphabet } from 'nanoid';

import { readFile, appendFile } from 'fs';

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = socketIO(server);

const publicPath = join(__dirname, "public");

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 4)

app.use(_json());

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.use(static(publicPath));

// Socket IO testing ground
io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    socket.on('disconnect', () => {
        console.log("user disconnected");
    });
    socket.on('newRoom', (name) => {
        //const userID = socket.id;
        console.log("new room");
        generateRoom(socket.id, name);
    });
});

function generateRoom(leader, username) {


    readFile("game.json", (data) => {
        let json = JSON.parse(data);
        console.log(leader, username)
        // do {
        //     var roomID = "ffff";
        //     console.log(roomID);
        // } while (roomID in json);
        // Check if room code already exists
        // if (roomID in json) return generateRoom(leader, username);
        // let roomJson = {
        //     "players": {
        //         leader
        //     }
        // }
    });
}

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/lobby', (req, res) => {
    res.render('lobby', { roomID: nanoid() });
});

app.get('/new', (req, res) => {
    // Generate game ID and send them to the lobby
    // Open socket.io connection and serve the correct lobby based on nanoid
    //res.send('New game waow' + nanoid());
    res.render('new');
});

app.get('/draw', (req, res) => {
    res.render('draw');
});

app.get('/:id', (req, res) => {
    // Redirect to lobby, check if invite link is invalid
    // Check database for room code, if invalid redirect to some error page or something
    // Else send them to the socket.io room
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
        appendFile(filePath, body, function() {
            res.send("ok");
        });
    });
});

app.get('getDrawing', (req, res) => {
    // Get drawing from data.json and display for user

});

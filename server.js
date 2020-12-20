const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

const port = 3000;
const host = '0.0.0.0';

//app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.listen(port, host, () => {
    console.log(`Listening on port ${host}:${port}`);
});
app.use(express.static("./public"));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/new', (req, res) => {
    // Generate game ID and send them there to the game ID
    res.send('New game waow');
});

app.get('/draw', (req, res) => {
    res.render('draw');
});

app.get('/:id', (req, res) => {
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
            res.end();
        });
    });
});

app.get('getDrawing', (req, res) => {
    // Get drawing from data.json and display for user

});
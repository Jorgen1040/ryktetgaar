const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const port = 3000;
const host = '0.0.0.0';

//app.use(cors());

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"))

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
    console.log(req.params)
    console.log(JSON.stringify(req.body))
});

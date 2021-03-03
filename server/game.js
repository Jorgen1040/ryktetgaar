const Sequence = require("./sequence");
const Words = require("./words");

const words = new Words();
words.loadWords();

class Game {
    constructor(id, io, onEmpty) {
        this.id = id;
        this.host;
        this.clients = [];
        this.onEmpty = onEmpty;
        this.sequences = [];
        this.started = false;
        this.io = io;
        this.round = 0;
    }
    sendToRoom(event, data) {
        this.io.to(this.id).emit(event, data);
    }
    addClient(client) {
        // Join SocketIO room
        client.socket.join(this.id);
        if (this.clients.length === 0) {
            this.host = client;
            client.makeHost();
        }
        this.clients.push(client);
        this.updateClientList();
        client.socket.on("disconnect", () => {
            // TODO: Allow for reconnection. See: https://stackoverflow.com/questions/20260170/handle-browser-reload-socket-io
            this.removeClient(client);
        });
        client.socket.on("startGame", () => {
            // Verify host
            if (!this.started && this.host === client) {
                this.startGame();
            }
        });
        client.socket.on("submitDrawing", (dataURL) => {
            // TODO: Replace this with findIndex?
            this.sequences.forEach((sequence) => {
                if (sequence.owner === client) {
                    sequence.addPart(dataURL);
                    client.ready = true;
                    this.updateWaiting();
                }
            });
        });
        client.socket.on("submitGuess", (guess) => {
            var clientIndex = this.clients.indexOf(client);
            this.sequences[clientIndex].addPart(guess);
            //console.log(this.sequences[clientIndex]);
            client.ready = true;
            this.updateWaiting();
        });
        client.socket.on("submitVote", (vote) => {

        });
    }
    removeClient(client) {
        client.socket.leave(this.id)
        const index = this.clients.indexOf(client);
        this.clients.splice(index, 1);
        // TODO: This is too slow, allowing a user to "connect" to a non existing room.
        // ? https://stackoverflow.com/questions/49547/how-do-we-control-web-page-caching-across-all-browsers
        // Delete game if empty
        if (this.clients.length === 0) {
            return this.onEmpty(this.id);
        }
        // Make next user host
        if (client === this.host) {
            this.host= this.clients[0];
            this.clients[0].makeHost();
        }
        this.updateClientList();
    }
    updateClientList() {
        let clients = [];
        this.clients.forEach((client) => {
            clients.push(client.getJson());
        });
        this.sendToRoom("updateClientList", clients);
    }
    startGame() {
        this.started = true;
        this.clients.forEach((client) => {
            let startWord = words.getWord();
            this.startSequence(client, startWord);
            client.send("gameStart", startWord);
        });
    }
    startSequence(client, startWord) {
        let newSequence = new Sequence(startWord, client);
        this.sequences.push(newSequence);
    }
    updateWaiting() {
        let clients = [];
        this.clients.forEach((client) => {
            if (!client.ready) {
                clients.push(client.getJson());
            }
        });
        this.sendToRoom("updateWaiting", clients);
        if (clients.length === 0) {
            this.shiftSequences();
        }
    }
    shiftSequences() {
        // Move last sequence to first slot
        this.sequences.unshift(this.sequences.pop());
        this.round++;
        this.newRound();
    }
    newRound() {
        // ! Ending game early for testing, should be this.clients.length
        if (this.round === 1) return this.endGame();
        this.clients.forEach((client, index) => {
            client.ready = false;
            // Get the last part of the sequence (which is either a dataURL or string)
            var data = this.sequences[index].parts[this.sequences[index].parts.length -1];
            if (this.round % 2 === 1) {
                client.send("newDrawing", data);
            } else {
                client.send("newWord", data);
            }
        });
    }
    endGame() {
        // TODO: Add end screen with voting
        this.sendToRoom("voteStart");
        this.sendToRoom("showVote", this.sequences[0].getJson());
    }
}

module.exports = Game;

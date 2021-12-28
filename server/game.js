const Part = require("./part");
const Sequence = require("./sequence");
const Words = require("./words");

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
        this.timeouts = []; // Houses all setTimeout functions (so we can delete on game delete)

        // Start deletion process in case no one joins
        this.timeouts.push(setTimeout(() => {
            if (this.clients.length === 0 && this.id != "7777") {
                this.clearTimeouts();
                this.onEmpty();
        }}, 300000 )); // 5 minutes
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
            // https://gist.github.com/m4tm4t/7696811
            this.removeClient(client);
        });
        client.socket.on("startGame", () => {
            // Verify host
            if (!this.started && this.host === client) {
                this.startGame();
            }
        });
        client.socket.on("submitDrawing", (dataURL) => {
            let clientIndex = this.clients.indexOf(client);
            this.sequences[clientIndex].addPart(new Part(client, "DRAWING", dataURL));
            client.ready = true;
            this.updateWaiting();
        });
        client.socket.on("submitGuess", (guess) => {
            let clientIndex = this.clients.indexOf(client);
            this.sequences[clientIndex].addPart(new Part(client, "WORD", guess));
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
        this.sequences.splice(index, 1);
        // TODO: This is too slow, allowing a user to "connect" to a non existing room.
        // ? https://stackoverflow.com/questions/49547/how-do-we-control-web-page-caching-across-all-browsers
        // Delete game if empty
        this.deleteGame();
        // Make next user host
        if (client === this.host && !this.clients.length === 0) {
            this.host = this.clients[0];
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
        const words = new Words();
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
        // TODO: Bug where a person gets lost on last round
        let clients = [];
        this.clients.forEach((client) => {
            if (!client.ready) {
                clients.push(client.getJson());
            }
        });
        this.sendToRoom("updateWaiting", clients);
        if (clients.length === 0) {
            // TODO: Check bug of this activating 1 player too early
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
        if (this.round === this.clients.length) return this.endGame();
        this.clients.forEach((client, index) => {
            client.ready = false;
            // Get the last part of the sequence (which is either a dataURL or string)
            var lastPart = this.sequences[index].parts[this.sequences[index].parts.length - 1];
            if (lastPart.type === "DRAWING") {
                client.send("newDrawing", lastPart.data);
            } else {
                client.send("newWord", lastPart.data);
            }
        });
    }
    endGame() {
        console.log("Ending game")
        // TODO: Add end screen with voting
        this.sendToRoom("voteStart");
        this.sendToRoom("showVote", this.getAllSequences());
    }
    getAllSequences() {
        let allSequences = [];
        this.sequences.forEach((sequence) => {
            allSequences.push(sequence.getJson());
        });
        return allSequences;
    }
    deleteGame() {
        // Wait 1 minute before deleting to allow reconnection
        this.timeouts.push(setTimeout(() => {
            if (this.clients.length === 0) {
                this.clearTimeouts();
                this.onEmpty();
        }}, 60000 )); // 1 minute
    }
    clearTimeouts() {
        // Removes extra timeouts to prevent them running after game is deleted
        this.timeouts.forEach((timeout) => {
            clearTimeout(timeout);
        });
    }
}

module.exports = Game;

const Sequence = require("./sequence");
const Words = require("./words");

const words = new Words();
words.loadWords();

class Game {
    constructor(id, io, onEmpty) {
        this.id = id;
        this.host;
        // TODO: Convert client list to an object to allow for easier search?
        this.clients = [];
        this.onEmpty = onEmpty;
        // TODO: Figure out how to do chains
        this.sequences = [];
        this.started = false;
        this.io = io;
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
            this.sequences.forEach((sequence) => {
                if (sequence.owner === client) {
                    sequence.addPart(dataURL);
                    client.ready = true;
                    this.updateWaiting();
                }
            });
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
        // TODO: Make this work without needing this.io
        // client.send("updateClientList", clients);
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
        if (clients.length === 0) {
            // TODO: Send drawings out when all clients are ready
        } else {
            this.sendToRoom("updateWaiting", clients);
        }
    }
}

module.exports = Game;

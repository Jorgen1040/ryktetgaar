class Game {
    constructor(id, onEmpty) {
        this.id = id;
        this.host;
        // TODO: Convert client list to an object to allow for easier search?
        this.clients = [];
        this.onEmpty = onEmpty;
        this.chain = [];
        this.started = false;
    }
    addClient(client) {
        // Join SocketIO room
        client.socket.join(this.id);
        if (this.clients.length === 0) {
            this.host = client;
            client.makeHost();
        }
        this.clients.push(client);
        client.socket.on("disconnect", () => {
            // TODO: Allow for reconnection. See: https://stackoverflow.com/questions/20260170/handle-browser-reload-socket-io
            this.removeClient(client);
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
            this.onEmpty(this.id);
            return;
        }
        // Make next user host
        if (client === this.host) {
            this.host= this.clients[0];
            this.clients[0].makeHost();
        }
        this.updateClientList(client.socket);
    }
    updateClientList(socket) {
        let clients = [];
        this.clients.forEach((client) => {
            clients.push(client.getJson());
        });
        socket.to(this.id).emit("updateClientList", clients);
    }
    startGame(socket) {
        this.clients.forEach((client) => {
            if (client.id === socket.id && this.host === client) {
                console.log("Game started")
                return this.started = true;
            } 
        });
    }
}

module.exports = Game;

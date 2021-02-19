class Game {
    constructor(id, onEmpty) {
        this.id = id;
        // ? The readable name, probably not that many at a time this.roomName = roomName;
        this.host;
        this.clients = [];
        this.onEmpty = onEmpty;
        this.chain = [];
    }
    addClient(client) {
        // Make client join socketio room
        client.socket.join(this.id)
        if (this.clients.length === 0) {
            this.host = client;
            client.makeHost();
        }
        this.clients.push(client);
        client.socket.on("disconnect", () => {
            this.removeClient(client);
        });
    }
    removeClient(client) {
        // TODO: Allow for reconnection
        const index = this.clients.indexOf(client);
        this.clients.splice(index, 1);
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
    updateClientList(io) {
        var clients = [];
        this.clients.forEach((client) => {
            clients.push(client.getJson());
        });
        io.to(this.id).emit("updateClientList", clients);
        //console.log("Updating client list")
    }
}

module.exports = Game;

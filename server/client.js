class Client {
    constructor(name, socket) {
        this.name = name;
        this.socket = socket;
        this.id = this.socket.id;
        this.ready = false;
        this.isHost = false;
    }
    makeHost() {
        this.isHost = true;
    }
    getJson() {
        return {
            name: this.name,
            isHost: this.isHost,
            id: this.id
        }
    }
}

module.exports = Client;

class Part {
    constructor(owner, type, data) {
        this.owner = owner;
        this.type = type;
        // this.data is technically redundant since the parts can only be in specified order
        this.data = data;
    }
    getJson() {
        return {
            owner: this.owner.name,
            type: this.type,
            data: this.data
        }
    }
}

module.exports = Part;

class Sequence {
    constructor(startWord, owner) {
        this.startWord = startWord;
        this.owner = owner;
        // 1st part is drawing, 2nd word, 3rd, drawing, 4th word
        this.parts = [];
    }
    addPart(part) {
        this.parts.push(part);
    }
    getJson() {
        return {
            owner: this.owner.name,
            startWord: this.startWord,
            parts: this.parts
        }
    }
}

module.exports = Sequence;
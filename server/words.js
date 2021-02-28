const fs = require("fs");
const path = require("path");

class Words {
    constructor() {
        this.words = [];
    }
    loadWords() {
        // TODO: Add all words from scans into words.txt
        var wordPath = path.join(__dirname, "words.txt");
        this.words = fs.readFileSync(wordPath).toString().split("\n");
        this.removeEmptyLines();
    }
    removeEmptyLines() {
        for (let i=0; i < this.words.length; i++) {
            if (this.words[i] === "") {
                this.words.splice(i, 1);
            }
        }
    }
    getWord() {
        let random = Math.floor(Math.random() * this.words.length);
        let randomWord = this.words[random];
        if (!randomWord) {
            console.error("getWord() returned empty/undefined string. Below is this.words");
            console.error(this.words);
        }
        this.words.splice(random, 1);
        return randomWord;
    }
}

module.exports = Words;
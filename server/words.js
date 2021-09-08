const fs = require("fs");
const path = require("path");

class Words {
    constructor() {
        this.words = [];
        this.loadWords();
    }
    loadWords() {
        // TODO: Add all words from scans into words.txt
        var wordPath = path.join(__dirname, "words.txt");
        this.words = fs.readFileSync(wordPath).toString().split("\n");
        this.removeEmptyLines();
    }
    removeEmptyLines() {
        let filtered = this.words.filter(e => e);
        this.words = filtered
    }
    getWord() {
        let random = Math.floor(Math.random() * this.words.length);
        let randomWord = this.words[random];
        if (!randomWord) {
            // This issue should be fixed, however keeping this error here in case it happens again
            console.error("getWord() returned empty/undefined string. Below is this.words");
            console.error(this.words);
        }
        this.words.splice(random, 1);
        return randomWord;
    }
}

module.exports = Words;

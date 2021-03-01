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
        this.words.forEach((word, index) => {
            if (word === "") {
                this.words.splice(index, 1);
            }
        });
    }
    getWord() {
        let random = Math.floor(Math.random() * this.words.length);
        let randomWord = this.words[random];
        if (!randomWord) {
            // TODO: Figure out why it does this (empty list, only 4 words in list)
            console.error("getWord() returned empty/undefined string. Below is this.words");
            console.error(this.words);
        }
        this.words.splice(random, 1);
        return randomWord;
    }
}

module.exports = Words;

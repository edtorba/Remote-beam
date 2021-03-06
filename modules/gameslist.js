// GamesList class - Storest list of games
function GamesList() {
    'use strict';
    
    this.list = new Object();
};

// Initialises new game
GamesList.prototype.init = function(roomName) {
    'use strict';
    
    this.list[roomName] = new Game();
};

// Checks if game exists
GamesList.prototype.exists = function(roomName) {
    'use strict';
    
    return this.list.hasOwnProperty(roomName);
};

// Delete game
GamesList.prototype.delete = function(roomName) {
    'use strict';
    
    if (this.exists(roomName)) {
        delete this.list[roomName];
    } else {
        console.log('Room: ' + roomName + ' does not exists');
    }
};

// Add round winner
GamesList.prototype.addRoundWinner = function(roomName, client) {
    'use strict';
    
    if (this.exists(roomName)) {
        this.list[roomName].addWinner(client);
    } else {
        console.log('Couldn\'t add round winner');
    }
};

// Checks if there is a round winner
GamesList.prototype.isThereARoundWinner = function(roomName, round) {
    'use strict';
    
    if (this.exists(roomName)) {
        return this.list[roomName].isThereARoundWinner(round);
    } else {
        console.log('Couldn\'t check round winner');
    }
};

// Sets the round word
GamesList.prototype.setWord = function(roomName, word) {
    'use strict';
    
    if (this.exists(roomName)) {
        this.list[roomName].setWord(word);
    } else {
        console.log('Couldn\'t set word');
    }
};

// Verifies words 
GamesList.prototype.compareWords = function(roomName, word) {
    'use strict';
    
    if (this.exists(roomName)) {
        return this.list[roomName].compareWords(word);
    } else {
        console.log('Couldn\'t compare words');
    }
};

module.exports = GamesList;

// Game class - Stores game data
function Game() {
    'use strict';
    
    this.word = null;
    this.rounds = new Array();
};

// Adds round winner
Game.prototype.addWinner = function(client) {
    'use strict';
    
    this.rounds.push(client);
};

// Check if there is a round winner
Game.prototype.isThereARoundWinner = function(round) {
    'use strict';
    
    return this.rounds.length == round ? true : false;
};

// Set word
Game.prototype.setWord = function(word) {
    'use strict';
    
    this.word = word;
};

// Compare words
Game.prototype.compareWords = function(word) {
    'use strict';
    
    return this.word == word ? true : false;
};
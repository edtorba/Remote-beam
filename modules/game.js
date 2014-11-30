// Game Class - Storest list of games and round results
function Games() {
    this.games = new Array();
    this.lookup = new Object();
};

Games.prototype.initGame = function() {
    // Init new game
    var game = new Game(roomName);
    
    // Push to games list
    this.games.push(game);
    
    // Refresh lookup object
    this.looukpRefresh();
};

Games.prototype.addWinner = function(roomName, client) {
    // Add winner
    this.games[this.lookup[roomName]].addWinner(client);
    console.log('Room: ' + roomName + ' Winner: ' + client);
};

Games.prototype.isThereAWinner = function(roomName, round) {
    // Find game
    if (this.lookup[roomName] !== undefined) {
        return this.games[this.lookup[roomName]].rounds.length == round ? true : false;
    }
};

Games.prototype.destroyGame = function(roomName) {
    // Check if game exists
    if (this.lookup[roomName] !== undefined) {
        this.games.splice(this.lookup[roomName], 1);
        
        // Refresh lookup object
        this.looukpRefresh();
    }
};

Games.prototype.looukpRefresh = function() {
    this.lookup = new Object();
    
    for(var i = 0; i < this.games.length; i++) {
        this.lookup[this.games[i].roomName] = i;
    }
};

module.exports = Games;

// Game Class stores round results
function Game(roomName) {
    this.roomName = roomName;
    this.rounds = [];
};

Game.prototype.addWinner = function(client) {
    this.rounds.push(client);
};
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

var GamesList = require('./modules/gameslist.js');
var gamesList = new GamesList();

var Words = require('./modules/words.js');
var words = new Words();

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    // User connected and disconnected block.
    console.log('A new user connected: ' + socket.id);
    
    socket.on('disconnect', function() {
        console.log('User disconnected: ' + socket.id);
        
        // Check if user was in a room
        // if yes, disconnect other player
        if (typeof socket.roomName !== undefined) {
            // Sending to all clients in room except sender
            socket.broadcast.to(socket.roomName).emit('opponentDisconnected');
            
            // Destroy game
            gamesList.delete(socket.roomName);
        }
    });
    
    // Create room
    socket.on('joinRoom', function(roomName) {
        console.log('Joining room: ' + roomName);
        
        if (numberOfClientsInTheRoom(roomName) < 2) {
            // Attach room name to a socket
            socket.roomName = roomName;

            // Join room
            socket.join(roomName);
            
            // Init game
            if (!gamesList.exists(roomName)) {
                gamesList.init(roomName);
            }

            // Check number of clients in the game
            // if 2 clients start the game
            if (numberOfClientsInTheRoom(roomName) == 2) {
                // Sending ready state to all clients in room, include sender
                io.sockets.in(roomName).emit('roomReady');
                
                // Start game
                startGame(roomName);
            }
            console.log('Number of clients in the room: ' + numberOfClientsInTheRoom(roomName));
        } else {
            console.log('Only 2 clients can be in the room');
        }
    });
    
    // Leave room
    socket.on('leaveRoom', function() {
        socket.leave(socket.roomName);
    });
    
    // Client shooted
    socket.on('gameShoot', function(round, word) {

        // Check if there is a current round winner
        if (!gamesList.isThereARoundWinner(socket.roomName, round)) {
            
            // Verify word
            if (gamesList.compareWords(socket.roomName, word)) {
                
                // Add winner
                gamesList.addRoundWinner(socket.roomName, socket.id);
                
                // Broadcast who's a round winner
                // To winner
                socket.emit('roundWinner', true);
                // To opponent
                socket.broadcast.to(socket.roomName).emit('roundWinner', false);
                
                // Start game
                startGame(socket.roomName);
            }
        }
    });
    
    // Start game
    function startGame(roomName) {
        'use strict';
        
        var word = words.getWord();
        gamesList.setWord(roomName, word);
        io.sockets.in(roomName).emit('gameStart', randomInterval(), word);
    };
});

http.listen(3000, function() {
    console.log('Listening on *:3000');
});


// Returns number of clients in the specified room
// http://stackoverflow.com/questions/24108833/node-js-socket-io-room-total-of-users
var numberOfClientsInTheRoom = function(roomName, namespace) {
    if (!namespace) namespace = '/';
    
    var room = io.nsps[namespace].adapter.rooms[roomName];
    if (!room) return null;
    
    var num = 0;
    for (var i in room) num++;
    
    return num;
}

// Returns random interval from 100ms to 1000ms
function randomInterval() {
    return Math.floor(Math.random() * (1000 - 100)) + 100;
};
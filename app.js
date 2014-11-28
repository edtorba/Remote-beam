var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

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
        if (socket.roomName !== undefined) {
            // Sending to all clients in room except sender
            socket.broadcast.to(socket.roomName).emit('opponentDisconnected');
        }
    });
    
    // Create room
    socket.on('joinRoom', function(code) {
        console.log('Joining room: ' + code);
        
        if (numRoomClients(code) < 2) {
        
            // Attach room name to a socket
            socket.roomName = code;

            // Join room
            socket.join(code);

            // Check number of clients in the game
            // if 2 clients start the game
            if (numRoomClients(code) == 2) {
                // Sending ready state to all clients in room, include sender
                io.sockets.in(code).emit('roomReady');
            }
            console.log('Number of clients in the room: ' + numRoomClients(code));
        } else {
            console.log('Only 2 clients can be in the room');
        }
    });
    
    // Leave room
    socket.on('leaveRoom', function() {
        socket.leave(socket.roomName);
    });
});

http.listen(3000, function() {
    console.log('Listening on *:3000');
});


// http://stackoverflow.com/questions/24108833/node-js-socket-io-room-total-of-users
var numRoomClients = function(roomName, namespace) {
    if (!namespace) namespace = '/';
    
    var room = io.nsps[namespace].adapter.rooms[roomName];
    if (!room) return null;
    
    var num = 0;
    for (var i in room) num++;
    
    return num;
}
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
    });
});

http.listen(3000, function() {
    console.log('Listening on *:3000');
});
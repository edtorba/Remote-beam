var socket = io();

window.onload = function() {
    'use strict';
    
    // Enable keys flag
    var keysFlag;
    
    // Keys
    var key = {
        'space' : 32,
        'enter' : 13
    };
    
    // Round count
    var round = -1;
    
    // All frames
    var frames = document.querySelectorAll('.frame-block');
    
    // Switch to frame function
    function switchToFrame(id) {
        // Hide all frames
        for(var i = 0; i < frames.length; i++) {
            frames[i].style.display = 'none';
        }

        // Show requested frame
        frames[id].style.display = 'block';
    };
    
    // Frame lookup object
    var frame = {
        'home': 0,
        'host': 1,
        'join': 2,
        'dc'  : 3,
        'game': 4
    };
    
    // Buttons list
    var button = {
        'frameHomeHost'  : document.getElementById('frameHomeHost'),
        'frameHomeJoin'  : document.getElementById('frameHomeJoin'),
        'frameJoinEnter' : document.getElementById('frameJoinEnter'),
        'frameDcGoHome'  : document.getElementById('frameDcGoHome')
    };
    
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    //////
    //////
    //////      Frame Home Events
    //////
    //////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    
    button.frameHomeHost.onclick = function() {
        // Generate code
        var code = randomCode(8, '#aA');
        
        // Place game code on the second frame
        document.getElementById('frameHostCode').innerHTML = code;
        
        // Emit to app.js
        socket.emit('joinRoom', code);
        
        // Switch to host frame
        switchToFrame(frame.host);
    };
    
    button.frameHomeJoin.onclick = function() {
        // Switch to join frame
        switchToFrame(frame.join);
    };
    
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    //////
    //////
    //////      Frame Host Events
    //////
    //////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    
    // N/A
    
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    //////
    //////
    //////      Frame Join Events
    //////
    //////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    
    button.frameJoinEnter.onclick = function() {
        // Get the code from the input field
        var code = document.getElementById('frameJoinCode').value;
        
        if (code.length == 0) {
            alert('Please enter code');
            
            return;
        }
        
        // Emit to app.js
        socket.emit('joinRoom', code);
    };
    
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    //////
    //////
    //////      Both Players Joined Event
    //////
    //////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    
    socket.on('roomReady', function() {
        // Both players joined, switch to game frame
        switchToFrame(frame.game);
        
    });
    
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    //////
    //////
    //////      One Player Disconnected
    //////
    //////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    
    socket.on('opponentDisconnected', function() {
        // TODO: Stop the game
        
        // Leave room
        socket.emit('leaveRoom');
        
        // Switch to disconnected frame
        switchToFrame(frame.dc);
    });
    
    button.frameDcGoHome.onclick = function() {
        // Switch to home frame
        switchToFrame(frame.home);
    };
    
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    //////
    //////
    //////      Frame Game Events
    //////
    //////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    
    // TODO: Frame game events
    socket.on('gameStart', function() {
        // Start countdown
        var messsage = document.getElementById('game__message');
        var messageShoot = document.getElementById('game__messageShoot');
        
        // Lock keys
        keysFlag = false;
        
        var counter = 10;
        var timer = setInterval(function() {
            counter--;
            if (counter === 0) {
                // Clear countdown
                messsage.innerHTML = '';
                
                // Show shoot message
                messageShoot.style.display = 'block';
                
                // Enable keys
                keysFlag = !keysFlag;
            } else if (counter === -1) {
                // Clear interval
                clearInterval(timer);
                
                // Hide shoot message
                messageShoot.style.display = 'none';
            } else if (counter < 5 && counter > 0) {
                messsage.innerHTML = counter;
            }
        }, 1000);
    });
    
    // Space bar listener
    document.onkeyup = function(e) {
        'use strict';
        e = e || window.event;
        
        // Check if hitting keys is allowed
        if (keysFlag) {
            if (e.keyCode == key.space) {
                // Emit to server / Shoot
                socket.emit('gameShoot', round);
                
                // Move to a next round
                round++;
                
                // Change keysFlag back to false
                keysFlag = !keysFlag;
            }
        }
    };
    
    socket.on('roundWinner', function(roundResult) {
        var message = document.getElementById('game__message'); 
        roundResult ? message.innerHTML = 'You Won!' : message.innerHTML = 'You Lost!';
        
        // Score
        var lost = document.getElementById('player__top--score');
        var won = document.getElementById('player__bottom--score');
        
        if (roundResult) {
            won.dataset.duelsWon++;
            won.innerHTML = 'Won ' + won.dataset.duelsWon + ' duels!';
        } else {
            lost.dataset.duelsLost++;
            lost.innerHTML = 'Won ' + lost.dataset.duelsLost + ' duels!';
        }
    });
};
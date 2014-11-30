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
    var round = 0;
    
    // Timer
    var timer;
    
    // All frames
    var frames = document.querySelectorAll('.frame-block');
    
    // Frame lookup object
    var frame = {
        'home': 0,
        'host': 1,
        'join': 2,
        'dc'  : 3,
        'game': 4,
        'switchTo' : function(id) {
            // Hide all frames
            for(var i = 0; i < frames.length; i++) {
                frames[i].style.display = 'none';
            }

            // Show requested frame
            frames[id].style.display = 'block';
        }
    };
    
    // Buttons list
    var button = {
        'frameHomeHost'  : document.getElementById('frameHomeHost'),
        'frameHomeJoin'  : document.getElementById('frameHomeJoin'),
        'frameJoinEnter' : document.getElementById('frameJoinEnter'),
        'frameDcGoHome'  : document.getElementById('frameDcGoHome')
    };
    
    // Score
    var score = {
        'lost'   : document.getElementById('player__top--score'),
        'won'    : document.getElementById('player__bottom--score'),
        'update' : function() {
            score.won.innerHTML = 'Won ' + score.won.dataset.duelsWon + ' duels!';
            score.lost.innerHTML = 'Won ' + score.lost.dataset.duelsLost + ' duels!';
        }
    };
    
    // Message
    var messages = {
        'message' : document.getElementById('game__message')
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
        frame.switchTo(frame.host);
    };
    
    button.frameHomeJoin.onclick = function() {
        // Switch to join frame
        frame.switchTo(frame.join);
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
        frame.switchTo(frame.game);
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
        // Reset local attributes e.g. round counter etc.
        clearInterval(timer);
        keysFlag = false;
        round = 0;
        score.won.dataset.duelsWon = 0;
        score.lost.dataset.duelsLost = 0;
        score.update();
        
        messages.message.innerHTML = 'Getting Ready';
        
        // Leave room
        socket.emit('leaveRoom');
        
        // Switch to disconnected frame
        frame.switchTo(frame.dc);
    });
    
    button.frameDcGoHome.onclick = function() {
        // Switch to home frame
        frame.switchTo(frame.home);
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
    
    socket.on('gameStart', function(randomTimer, randomWord) {
        console.log(randomWord);
        // Lock keys
        keysFlag = false;
        
        // New round
        round++;
        
        // Start countdown
        var counter = 7;
        timer = setInterval(function() {
            counter--;
            
            if (counter < 5 && counter > 0) {
                // Display countdown
                messages.message.innerHTML = counter;
            } else if (counter === 0) {
                // Clear countdown
                messages.message.innerHTML = '';
                
                // Enable keys
                keysFlag = !keysFlag;
                
                // Clear interval
                clearInterval(timer);
            }
        }, randomTimer);
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
                
                // Change keysFlag back to false
                keysFlag = !keysFlag;
            }
        }
    };
    
    socket.on('roundWinner', function(roundResult) {
        roundResult ? messages.message.innerHTML = 'You Won!' : messages.message.innerHTML = 'You Lost!';
        
        roundResult ? score.won.dataset.duelsWon++ : score.lost.dataset.duelsLost++;
        
        score.update();
    });
};
var socket = io();

window.onload = function() {
    'use strict';
    
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    //////
    //////
    //////      Attributes
    //////
    //////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    var keysFlag;
    var key = {
        'space': 32,
        'enter': 13
    };
    
    var timer;
    var round = 0;
    var word;
    
    var frames = document.querySelectorAll('.frame-block');
    var frame = {
        'home': 0,
        'host': 1,
        'join': 2,
        'opponentLeft'  : 3,
        'game': 4,
        'dc': 5,
        'switchTo' : function(id) {
            // Hide all frames
            for(var i = 0; i < frames.length; i++) {
                frames[i].style.display = 'none';
            }

            // Show requested frame
            frames[id].style.display = 'block';
        }
    };
    
    var button = {
        'frameHomeHost'  : document.getElementById('frameHomeHost'),
        'frameHomeJoin'  : document.getElementById('frameHomeJoin'),
        'frameJoinEnter' : document.getElementById('frameJoinEnter'),
        'frameOpponentLeftGoHome' : document.getElementById('frameOpponentLeftGoHome')
    };
    
    var input = {
        'word': document.getElementById('player__word'),
        'code': document.getElementById('frameJoinCode')
    };
    
    var score = {
        'lost'   : document.getElementById('player--top-score'),
        'won'    : document.getElementById('player--bottom-score'),
        'update' : function() {
            score.won.innerHTML = 'Won ' + score.won.dataset.duelsWon + ' duels!';
            score.lost.innerHTML = 'Won ' + score.lost.dataset.duelsLost + ' duels!';
        }
    };
    
    var message = {
        'game': document.getElementById('game__message'),
        'code': document.getElementById('frameHostCode'),
        'set': function(elem, msg) {
            elem.innerHTML = msg;
        }
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
        var code = randomCode(5, '#aA');
        
        // Place game code on the second frame
        message.set(message.code, code);
        
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
        var code = input.code.value;
        
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
    //////      Both Players Joined - switch to game frame
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
        // Reset Game
        resetGame();
        
        // Leave room
        socket.emit('leaveRoom');
        
        // Switch to disconnected frame
        frame.switchTo(frame.opponentLeft);
    });
    
    button.frameOpponentLeftGoHome.onclick = function() {
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
        // Word
        word = randomWord;
        
        // Lock keys
        keysFlag = false;
        
        // New round
        round++;
        
        // Remove class(es) from input field
        input.word.className = '';
        
        // Set focus on input field
        input.word.focus();
        
        // Start countdown
        var counter = 7;
        timer = setInterval(function() {
            counter--;
            
            if (counter < 5 && counter > 0) {
                // Display countdown
                message.set(message.game, counter);
            } else if (counter === 0) {
                // Clear countdown
                message.set(message.game, randomWord);
                
                // Enable keys
                keysFlag = !keysFlag;
                
                // Clear interval
                clearInterval(timer);
            }
        }, randomTimer);
    });
    
    // Enter button listener
    document.onkeyup = function(e) {
        'use strict';
        e = e || window.event;
        
        // Check if keys are enabled
        if (keysFlag) {
            if (e.keyCode == key.enter) {
                if (input.word.value.trim().length > 0) {
                    // Compare words
                    if (word === input.word.value) {
                        // Remove classes
                        input.word.className = '';
                        
                        // Emit word to server
                        socket.emit('gameShoot', round, input.word.value);
                        
                        // Disable keys
                        keysFlag = !keysFlag;
                    } else {
                        input.word.className = 'player__word--error';
                    }
                }
            }
        }
    };
    
    socket.on('roundWinner', function(roundResult) {
        // Show who won
        roundResult ? message.set(message.game, 'You Won!') : message.set(message.game, 'You Lost!')
        
        // Increase score
        roundResult ? score.won.dataset.duelsWon++ : score.lost.dataset.duelsLost++;
        
        // Clear input field
        input.word.value = '';
        
        score.update();
    });
    
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    //////
    //////
    //////      Shared functions / events
    //////
    //////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    
    function resetGame() {
        clearInterval(timer);
        keysFlag = false;
        round = 0;
        word = null;
        score.won.dataset.duelsWon = 0;
        score.lost.dataset.duelsLost = 0;
        score.update();
        input.word.value = '';
        input.word.className = '';
        input.code.value = '';
        
        message.set(message.game, 'Getting Ready');
    };
    
    socket.on('disconnect', function() {
        frame.switchTo(frame.dc);
        resetGame();
    });

    socket.on('connect', function() {
        frame.switchTo(frame.home);
    });
};
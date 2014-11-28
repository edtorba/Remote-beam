var socket = io();

window.onload = function() {
    'use strict';
    
    // All frames
    var frames = document.querySelectorAll('.frame-block');
    
    // Switch to frame function
    function switchToFrame(id) {
        // Hide all frames
        for(var i = 0; i < frames.length; i++) {
            frames[i].style.display = 'none';
        }

        // Show requested frame
        frame[id].style.display = 'block';
    };
    
    // Frame lookup object
    var frame = {
        'home': 0,
        'host': 1
    };
    
    // Buttons list
    var button = {
        'frameHomeHost' : document.getElementById('frameHomeHost'),
        'frameHomeJoin' : document.getElementById('frameHomeJoin')
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
        
        // Emit to app.js
        
        // Switch to host frame
        switchToFrame(frame.host);
    };
    
    button.frameHomeJoin.onclick = function() {
          // Switch to join frame
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
    
    // TODO: Wait for the second player and redirect to Game frame
    
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    //////
    //////
    //////      Frame Join Events
    //////
    //////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    
    // TODO: Submit game code and redirect to Game frame if correct
};
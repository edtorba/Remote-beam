// An object holding all of the currently pressed keys
var keyState = {};

// Keys
var key = {
    'space' : 32,
    'enter' : 13
};

document.onkeydown = function(e) {
    'use strict';
    e = e || window.event;
    keyState[e.keyCode] = true;
};

document.onkeyup = function(e) {
    'use strict';
    e = e || window.event;
    delete keyState[e.keyCode];
};
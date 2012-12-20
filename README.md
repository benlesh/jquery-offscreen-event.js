JQuery.offscreen.event.js
=========================

An offscreen event implementation for JQuery

This JQuery plugin will add an "offscreen" event type to JQuery.

Demo here: http://jsfiddle.net/blesh/H4s5B/

To be used as follows:

    $('#someselector').on('offscreen', function(e) {
        var off = e.offscreen;
        off.top; //# pixels off to the top.
        off.bottom; //# pixels off to the bottom.
        off.left; //# pixels off to the left.
        off.right; //# pixels off to the right.
    });
    
It will also work with on(event, selector, fn), like so:

    $('#foo').on('offscreen', '.bar', function(e) {
        //do stuff
    });


/*
JQuery offscreen event v 0.0.1
Copyright (c) 2012 Ben Lesh
http://www.benlesh.com
ben@benlesh.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function($, document, window) {
    var uid = 0;
    $.event.special.offscreen = {
        setup: function(data, namespaces, handler) {
            var watched = $(document).data('offscreen.watched');
            if (!watched) {
                watched = {};
                $(document).data('offscreen.watched', watched);
                $(document).on('scroll', $.event.special.offscreen.handler);
            }
            watched[uid] = {
                elem: this,
                delegateTarget: this,
                handler: handler
            };
            $(this).data('offscreen.uid', uid++);

        },
        teardown: function(namespaces, handler) {
            var self = $(this),
                watched = $(document).data('offscreen.watched');
            delete watched[self.data('offscreen.uid')];
            if (watched.length === 0) {
                watched = null;
                $(document).off('scroll', $.event.special.offscreen.handler);
            }
        },
        handler: function(event) {
            var doc = $(document),
                watched = doc.data('offscreen.watched');
            for (var uid in watched) {
                var prop = watched[uid],
                    elems = [ prop.elem ];
                if(prop.selector) {
                      elems = $(prop.elem).find(prop.selector);   
                }
                for(var i = 0; i < elems.length; i++) {
                    var elem = elems[i];
                    if (elem) {
                        var offset = $(elem).offset(),
                            scrollLeft = $(document).scrollLeft(),
                            scrollTop = $(document).scrollTop(),
                            offscreen = {
                                left: scrollLeft - offset.left,
                                top: scrollTop - offset.top,
                                bottom: offset.top - (scrollTop + $(window).height()),
                                right: offset.left - (scrollLeft + $(window).width())
                            };
                        if (offscreen.left > 0 || offscreen.top > 0 || offscreen.bottom > 0 || offscreen.right > 0) {
                            event.type = 'offscreen';
                            event.offscreen = offscreen;
                            event.target = elem;
                            $.event.handle.apply(prop.delegateTarget, arguments);
                        }
                    }
                }
            }
        }, 
        add: function(handleObj) {
            if (handleObj.selector) {
                var self = $(this),
                    watched = $(document).data('offscreen.watched'),
                    uid = self.data('offscreen.uid'),
                    prop = watched[uid];
                prop.selector = handleObj.selector;
            }
        }
    };
})(jQuery, document, window);

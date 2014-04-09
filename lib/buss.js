(function (global) {
    'use strict';
    function each (obj, fn, context) {
        var i, nth;

        if (!obj) {
            return;
        }

        if (obj.forEach === Array.prototype.forEach) {
            return obj.forEach(fn, context);
        }

        if (obj.length === +obj.length) {
            for (i = 0, nth = obj.length; i < nth; i++) {
                fn.call(context || obj, obj[i], i, obj);
            }
        }
        else {
            var keys = Object.keys(obj);

            for (i = 0, nth = keys.length; i < nth; i++) {
                var key = keys[i];

                fn.call(context || obj, obj[key], key, obj);
            }
        }
    }
    function extend (obj) {
        each([].slice.call(arguments, 1), function (source) {
            each(source, function (value, key) {
                obj[key] = value;
            });
        });

        console.log(arguments);
        return obj;
    }
    function mixin (target, source) {
        extend(target, source);

        function Constructor () {
            this.constructor = target;
        }

        Constructor.prototype = source.prototype;

        target.prototype = new Constructor();
        target.__super__ = source.prototype;

        return target;
    }
    // Basic Event Emitter
    function Emitter () {
        this.events  = {};
        this.context = null;
    }

    Emitter.prototype.bind = function (event, callback) {
        var events = this.events[event] || (this.events[event] = []);
        events.push(callback);

        return this;
    };

    Emitter.prototype.unbind = function (event, callback) {
        var self    = this,
            events  = this.events[event];

        if (event === '*') {
            if (!callback) {
                this.events = {};
            }
            else {
                each(this.events, function (events, event) {
                    self.unbind(event, callback);
                });
            }
        }
        else if (callback && events) {
            events.splice(events.indexOf(callback), 1);

            if (events.length === 0) {
                delete this.events[event];
            }
        }
        else {
            delete this.events[event];
        }

        return this;
    };

    Emitter.prototype.emit = function (event /* , args... */) {
        var events  = this.events[event],
            context = this.context || this;

        if (events) {
            var callbacks = events.slice(0),
                args      = [].slice.call(arguments, 1),
                nth       = events.length,
                i         = -1;

            while (++i < nth) {
                callbacks[i].apply(context, args);
            }
        }

        return this;
    };

    Emitter.prototype.once = function (event, callback) {
        var self = this;

        function suicide () {
            callback.apply(self, arguments);

            self.unbind(event, callback);
        }

        return this.bind(event, suicide);
    };
    function DOMEmitter (element) {
        Emitter.call(this);

        this.element = element;
        this.proxied = {};
    }

    mixin(DOMEmitter, Emitter);

    DOMEmitter.prototype._proxy = function (event) {
        return (function (DOMEvent) {
            var selector = getSelector(event),
                context  = this.element;

            if (selector) {
                context = DOMEvent.target;

                while (context && context != selector) {
                    context = context !== this.element && context.parentNode;
                }

                if (!context || context == this.element) {
                    return;
                }
            }

            this.context = context;

            this.emit(event, DOMEvent, this.element);
        }).bind(this);
    };

    DOMEmitter.prototype.proxy = function (event) {
        return this.proxied[event] || (this.proxied[event] = this._proxy(event));
    };

    DOMEmitter.prototype.bind = function (event, callback) {
        Emitter.prototype.bind.call(this, event, callback);

        if (!this.proxied[event]) {
            this.element.addEventListener(getType(event), this.proxy(event), false);
        }

        return this;
    };

    DOMEmitter.prototype.unbind = function (event, callback) {
        if (event.indexOf('*') >= 0) {
            var self = this,
                reg  = new RegExp('^' + event.replace('*', '\\b'));

            each(this.events, function (events, event) {
                if (reg.test(event)) {
                    self.unbind(event, callback);
                }
            });
        }
        else {
            var proxy = this.proxied[event];

            Emitter.prototype.unbind.call(this, event, callback);

            if (!this.events[event] && proxy) {
                this.element.removeEventListener(getType(event), proxy, false);

                delete this.proxied[event];
            }
        }

        return this;
    };

    DOMEmitter.prototype.destroy = function () {
        return this.unbind('*');
    };

    DOMEmitter.prototype.trigger = function (event, data) {
        if (!(event instanceof window.Event)) {
            event = createEvent(event);
        }

        event.data = data;

        this.element.dispatchEvent(event);

        return this;
    };

    // Utilities
    function getType (event) {
        var index = event.indexOf(' ');

        return index > 0 ? event.substr(0, index) : event;
    }

    function getSelector (event) {
        var index = event.indexOf(' ');

        return index > 0 ? event.substr(index) : '';
    }

    function createEvent (type, properties) {
        if (typeof type != 'string') {
            type = type.type;
        }

        var isMouse = (['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(type) != -1),
            event   = document.createEvent(isMouse ? 'MouseEvent' : 'Event');

        if (properties) {
            extend(event, properties);
        }

        event.initEvent(type, true, true);

        return event;
    }
    var buss = {
        Emitter: Emitter,
        DOMEmitter: DOMEmitter
    };

    if (typeof module != 'undefined' && module.exports) {
        module.exports = buss;
    }
    else {
        global.Buss = buss;
    }
})(this);
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
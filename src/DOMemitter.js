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
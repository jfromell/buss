function makeElement (tagName, html, attr) {
    var el = document.createElement(tagName);
    el.innerHTML = html;

    for (var key in attr) {
        var value = attr[key];

        el[key] = value;
    }

    return el;
}


describe('DOMEmitter', function () {
    describe('when calling `bind(event, callback)`', function () {
        it('should bind a callback to the event', function () {
            var div = makeElement('div'),
                cb  = sinon.spy();

            var emitter = new Buss.DOMEmitter(div);

            emitter.bind('click', cb);
            emitter.trigger('click');

            expect(cb).to.have.callCount(1);
        });
    });

    describe('when calling `unbind(event, callback)`', function () {
        it('should unbind the callback from the event', function () {
            var div = makeElement('div'),
                cb  = sinon.spy();

            var emitter = new Buss.DOMEmitter(div);

            emitter.bind('click', cb);
            emitter.unbind('click', cb);

            emitter.trigger('click');

            expect(cb).to.have.callCount(0);
        });
    });

    describe('when calling `unbind(event)`', function () {
        it('should unbind all callbacks from the event', function () {
            var div = makeElement('div'),
                cb1 = sinon.spy(),
                cb2 = sinon.spy();

            var emitter = new Buss.DOMEmitter(div);

            emitter.bind('click', cb1);
            emitter.bind('click', cb2);

            emitter.unbind('click');
            emitter.trigger('click');

            expect(cb1).to.have.callCount(0);
            expect(cb2).to.have.callCount(0);
        });
    });

    describe('when calling `unbind("*", callback)`', function () {
        it('should unbind the callback from all events', function () {
            var div = makeElement('div'),
                cb  = sinon.spy();

            var emitter = new Buss.DOMEmitter(div);

            emitter.bind('click', cb);
            emitter.bind('mouseover', cb);

            emitter.unbind('*', cb);

            emitter.trigger('click');
            emitter.trigger('mouseover');

            expect(cb).to.have.callCount(0);
        });
    });

    describe('when calling `unbind("*")`', function () {
        it('should unbind all callbacks from all events', function () {
            var div = makeElement('div'),
                cb1 = sinon.spy(),
                cb2 = sinon.spy();

            var emitter = new Buss.DOMEmitter(div);

            emitter.bind('click', cb1);
            emitter.bind('mouseover', cb1);
            emitter.bind('click', cb2);
            emitter.bind('mouseover', cb2);

            emitter.unbind('*');

            emitter.trigger('click');
            emitter.trigger('mouseover');

            expect(cb1).to.have.callCount(0);
            expect(cb2).to.have.callCount(0);
        });
    });

    describe('when calling `once(event, callback)`', function () {
        it('should only apply the callback only once', function () {
            var div = makeElement('div'),
                cb  = sinon.spy();

            var emitter = new Buss.DOMEmitter(div);
            emitter.once('click', cb);

            emitter.trigger('click');
            emitter.trigger('click');

            expect(cb).to.have.callCount(1);
        });
    });
});
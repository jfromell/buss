var noop = function () {};

describe('Emitter', function () {

    describe('when calling `bind(event, callback)`', function () {
        it('should bind a callback to the event', function () {
            var emitter = new Buss.Emitter();

            emitter.bind('click', noop);

            expect(emitter.events['click']).to.have.length(1);
        });
    });

    describe('when calling `unbind(event, callback)`', function () {
        it('should unbind a callback from the event', function () {
            var emitter = new Buss.Emitter();

            emitter.bind('click', noop);
            emitter.unbind('click', noop);

            expect(emitter.events['click']).to.be.undefined;
        });
    });

    describe('when calling `unbind(event)`', function () {
        it('should unbind all callbacks from the event', function () {
            var emitter = new Buss.Emitter();

            emitter.bind('click', noop);
            emitter.bind('click', noop);

            emitter.unbind('click');

            expect(emitter.events['click']).to.be.undefined;
        });
    });

    describe('when calling `unbind("*", callback)', function () {
        it('should unbind the callback from all events', function () {
            var emitter = new Buss.Emitter();

            emitter.bind('click', noop);
            emitter.bind('keydown', noop);

            emitter.unbind('*', noop);

            expect(emitter.events['click']).to.be.undefined;
            expect(emitter.events['keydown']).to.be.undefined;
        });
    });

    describe('when calling `unbind("*")`', function () {
        it('should unbind all callbacks from all events', function () {
            var emitter = new Buss.Emitter();

            emitter.bind('click', noop);
            emitter.bind('keydown', noop);

            emitter.unbind('*');

            expect(emitter.events['click']).to.be.undefined;
            expect(emitter.events['keydown']).to.be.undefined;
        });
    });

    describe('when calling `emit(arg)`', function () {
        it('should apply the bound callback', function () {
            var emitter = new Buss.Emitter(),
                callback= sinon.spy();

            emitter.bind('click', callback);

            emitter.emit('click', true);

            expect(callback).to.have.callCount(1);
        });

        it('should supply the callback with the correct argument(s)', function () {
            var emitter = new Buss.Emitter(),
                callback= sinon.spy();

            emitter.bind('click', callback);

            emitter.emit('click', 'success');

            expect(callback).to.have.been.calledWith('success');
        });
    });

    describe('when calling `once(arg)`', function () {
        it('should only apply the bound callback once', function () {
            var emitter = new Buss.Emitter(),
                callback= sinon.spy();

            emitter.once('click', callback);

            emitter.emit('click', true);
            emitter.emit('click', false);

            expect(callback).to.have.callCount(1);
        });
    });
});
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
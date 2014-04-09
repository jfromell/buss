    var nytta = {
        each: each,
        extend: extend,
        mixin: mixin
    };

    if (typeof module != 'undefined' && module.exports) {
        module.exports = nytta;
    }
    else {
        global.nytta = nytta;
    }
})(this);
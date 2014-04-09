    function mixin (target, source) {
        extend(target, source);

        function Constructor () {
            this.constructor = target;
        }

        Constructor.prototype = source.prototype;

        child.prototype = new Constructor();
        child.__super__ = source.prototype;

        return child;
    }
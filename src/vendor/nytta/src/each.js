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
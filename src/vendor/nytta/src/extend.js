    function extend (obj) {
        each([].slice.call(arguments, 1), function (source) {
            each(source, function (value, key) {
                obj[key] = value;
            });
        });

        return obj;
    }
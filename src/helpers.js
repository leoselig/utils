module.exports = {

    extend: function(base) {
        for (var i = 1; i < arguments.length; i++) {
            for (var j in arguments[i]) {
                base[j] = arguments[i][j];
            }
        }
        return base;
    },

    accessor: function(name, callback) {
        return function(value) {
            var oldValue = this['_' + name];
            if (arguments.length === 0) {
                return oldValue;
            }
            this['_' + name] = value;
            if (oldValue !== value) {
                if (typeof callback === 'string') {
                    callback = this[callback];
                } else if (typeof callback === 'function') {
                    callback.call(this, value);
                }
            }
            return this;
        };
    },

    constantFunction: function(value) {
        return function() {
            return value;
        };
    },

    isString: function(obj) {
        return typeof obj === 'string';
    },

    isUndefined: function(obj) {
        return typeof obj === 'undefined';
    },

    toArray: function(arr) {
        return Array.prototype.slice.call(arr, 0);
    },

    containsAny: function(arr, elements) {
        var match = false;
        elements.some(function(element) {
            match = arr.indexOf(element) >= 0;
            return match;
        });
        return match;
    },

    rotate: function(value, min, max) {
        if (value === max) {
            return min;
        }
        return ++value;
    },

    assert: function(condition, message) {
        if (!condition) {
            console.error(message);
        }
    }
};

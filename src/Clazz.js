var helpers = require('./helpers');

var Clazz = function() {
    return this.init.apply(this, arguments);
};

Clazz.prototype = {

    init: function() {

    },

    callSuper: function(args) {
        return args.callee.__super__.apply(this, args);
    }
};

Clazz.extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function() {
            return parent.apply(this, arguments);
        };
    }

    helpers.extend(child, parent, staticProps);

    var Surrogate = function() {
        this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    if (protoProps) {
        for (var prop in protoProps) {
            if (typeof protoProps[prop] === 'function') {
                protoProps[prop].__super__ = parent.prototype[prop];
            }
            child.prototype[prop] = protoProps[prop];
        }
    }

    return child;
};

Clazz.mixin = function(mixins) {
    var mixin;
    var origInit = this.prototype.init;
    for (var i = 0; i < arguments.length; i++) {
        mixin = arguments[i];
        helpers.extend(this.prototype, mixin.protoProps);
        helpers.extend(this, mixin.staticProps);
        if (typeof mixin.init === 'function') {
            this.prototype.init = (function(origInit) {
                return function() {
                    mixin.init.apply(this, arguments);
                    return origInit.apply(this, arguments);
                };
            })(origInit);
            origInit = this.prototype.init;
        }
    }
    return this;
};

module.exports = Clazz;

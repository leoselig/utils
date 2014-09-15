var Clazz = require('./Clazz');
var helpers = require('./helpers');

var Promise = function() {
    return this.init.apply(this, arguments);
};

module.exports = Clazz.extend({

    _thenChain: null,
    _errorChain: null,
    _resolvedArgs: null,

    init: function() {
        this._thenChain = [];
        this._errorChain = [];
        this._lastArgs = [];
    },

    resolve: function() {
        var nextThen = this._thenChain[0];
        var resolveArgs = helpers.toArray(arguments);
        if (nextThen) {
            if (resolveArgs[0] instanceof this.constructor) {
                var recursivePromise = resolveArgs.shift();
                recursivePromise
                    .then(function(done) {
                        var combinedArgs = resolveArgs.concat(helpers.toArray(arguments).slice(1));
                        this.resolve.apply(this, combinedArgs);
                        done();
                    }.bind(this))
                    .error(function() {
                        this.reject.apply(this, arguments);
                    }.bind(this));
            } else {
                resolveArgs.unshift(this.doneCallback().bind(this));
                this._thenChain.shift();
                nextThen.apply(null, resolveArgs);
            }

        } else {
            this.resolvedArgs(resolveArgs);
        }
        return this;
    },

    reject: function() {
        while (this._errorChain.length > 0) {
            this._errorChain.shift().apply(null, arguments);
        }
        return this;
    },

    then: function(callback) {
        this._thenChain.push(callback);
        if (this.resolved()) {
            this.resolved(false);
            this.resolve.apply(this, this.resolvedArgs());
        }
        return this;
    },

    error: function(callback) {
        this._errorChain.push(callback);
        return this;
    },

    when: function(promises) {
        var this_ = this;
        var args = [];
        (function next() {
            if (promises.length === 0) {
                this_.resolve(args);
                return;
            }
            promises.shift().then(function(done) {
                args.push(arguments);
                next();
                done();
            });
        })();
        return this;
    },

    resolvedArgs: helpers.accessor('resolvedArgs'),

    resolved: function() {
        return this.resolvedArgs() !== null;
    },

    doneCallback: function() {
        return function() {
            this.resolve.apply(this, arguments);
        };
    }
});

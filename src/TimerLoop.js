var Clazz = require('./Clazz');
var helpers = require('./helpers');
var Promise = require('./Promise');

module.exports = Clazz.extend({

    _interval: null,
    _intervalID: null,
    _callback: null,
    _endTimeout: null,

    every: function(interval) {
        this.interval(interval);
        return this;
    },

    perform: function(callback) {
        this.callback(callback);
        return this;
    },

    runFor: function(duration) {
        if (this.endTimeout() !== null) {
            window.clearTimeout(this.endTimeout());
        }
        this.run();
        var promise = new Promise();
        this.endTimeout(window.setTimeout(function() {
            this.stop();
            promise.resolve();
        }.bind(this), duration));
        return promise;
    },

    run: function(immediately) {
        if (this.running()) {
            return;
        }
        if (immediately !== false) {
            this.callback()();
        }
        this.intervalID(window.setInterval(
            this.callback(),
            this.interval()
        ));
        return this;
    },

    stop: function() {
        window.clearInterval(this.intervalID());
        this.intervalID(null);
        return this;
    },

    running: function() {
        return this.intervalID() !== null;
    },

    endTimeout: helpers.accessor('endTimeout'),

    interval: helpers.accessor('interval'),

    callback: helpers.accessor('callback'),

    intervalID: helpers.accessor('intervalID')

});

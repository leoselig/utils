var Clazz = require('./Clazz');
var helpers = require('./helpers');
var Promise = require('./Promise');

module.exports = Clazz.extend({

    _timeoutID: null,
    _callback: null,
    _delay: null,

    after: function(delay) {
        this.delay(delay);
        return this;
    },

    perform: function(callback) {
        this.callback(callback);
        return this;
    },

    run: function() {
        this.timeoutID(
            window.setTimeout(
                this.callback(),
                this.delay()
            )
        );
        return this;
    },

    cancel: function() {
        window.clearTimeout(this.timeoutID());
        this.timeoutID(null);
        return this;
    },

    running: function() {
        return this.timeoutID() !== null;
    },

    delay: helpers.accessor('delay'),

    callback: helpers.accessor('callback'),

    timeoutID: helpers.accessor('timeoutID')

});

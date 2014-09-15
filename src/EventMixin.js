var helpers = require('./helpers');

module.exports = {

    protoProps: {

        _listeners: null,

        _listenings: null,

        on: function(observable, events, callback) {
            this._ensureEventProperties();
            try {
                events.split(' ').forEach(function(event) {
                    this._ensureEvent(event);
                    this.listenings()[event].push({
                        observable: observable,
                        event: event,
                        callback: callback
                    });
                    observable._on(event, callback);
                }.bind(this));
            } catch (e) {
                debugger;
            }
            return this;
        },

        off: function(obserable, event, callback) {
            if (typeof observable === 'undefined') {
                observable = null;
                event = null;
                callback = null;
            } else if (typeof observable === 'string') {
                event = observable;
                observable = null;

                if (typeof callback === 'undefined') {
                    callback = null;
                }
            } else if (typeof callback === 'undefined') {
                callback = null;
            }
            this._normalizedOff();
            return this;
        },

        once: function(observable, events, callback) {
            var latchCallback = function() {
                callback.apply(this, arguments);
            };
            latchCallback._onceOrigin = callback;
            return this.on(observable, events, latchCallback);
        },

        _normalizedOff: function(obserable, event, callback) {
            var listenings = this.listenings();
            var eventListenings;
            for (var event in listenings) {
                eventListenings = listenings[event];
                eventListenings.forEach(function(listening, index) {
                    var observableMatch = !observable || (listening.observable === observable);
                    var eventMatch = !event || (listening.event === event);
                    var callbackMatch = !callback || (listening.callback === callback) || (listening.callback._onceOrigin === callback);
                    if (observableMatch && eventMatch && callbackMatch) {
                        listening.observable._off(event, callback);
                        eventListenings.splice(index, 1);
                    }
                }.bind(this));
            }
        },

        _on: function(events, callback) {
            this._ensureEventProperties();
            events.split(' ').forEach(function(event) {
                this._ensureEvent(event);
                this.listeners()[event].push(callback);
            }.bind(this));
            return this;
        },

        _off: function(event, callback) {
            if (typeof event === 'undefined') {
                this.listeners({});
            } else if (!callback) {
                this.listeners()[event].splice(0);
            } else {
                this.listeners()[event].splice(this.listeners().indexOf(callback), 1);
            }
            return this;
        },

        emit: function(event) {
            this._ensureEventProperties();
            if (typeof this.listeners()[event] === 'undefined') {
                return;
            }
            var callback;
            var args = Array.prototype.slice.call(arguments, 1);
            this.listeners()[event].forEach(function(callback) {
                callback.apply(null, args);
            }.bind(this));
            return this;
        },

        _ensureEventProperties: function() {
            if (this.listeners() === null) {
                this.listeners({});
            }
            if (this.listenings() === null) {
                this.listenings([]);
            }
        },

        _ensureEvent: function(event) {
            this._ensureEventProperties();
            if (typeof this.listeners()[event] === 'undefined') {
                this.listeners()[event] = [];
                this.listenings()[event] = [];
            }
        },

        listeners: helpers.accessor('listeners'),

        listenings: helpers.accessor('listenings')
    },

    staticProps: {

    }

};

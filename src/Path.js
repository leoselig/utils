var helpers = require('./helpers');
var Clazz = require('./Clazz');

module.exports = Clazz.extend({

    _protocol: null,
    _host: null,
    _port: null,
    _pathParts: null,
    _params: null,

    init: function() {
        this._pathParts = [];
        var part;
        for (var i = 0; i < arguments.length; i++) {
            part = arguments[i];
            this.addPath(part);
        }
    },

    clone: function() {
        var path = new this.constructor();
        path.init();
        path.protocol(this.protocol());
        path.host(this.host());
        path.port(this.port());
        this._pathParts.forEach(function(part) {
            path.addPath(part);
        });
        return path;
    },

    navigate: function(path) {
        var clone = this.clone();
        return clone.addPath.apply(clone, arguments);
    },

    addPath: function(path) {
        var path = Array.prototype.join.call(arguments, '/');
        path.split('/').forEach(function(part, index) {
            // Only leading slash is allowed
            if ((part !== '') || ((index === 0) && (this._pathParts.length === 0))) {
                this._pathParts.push(part);
            }
        }.bind(this));
        return this;
    },

    completeHost: function() {
        var result = '';
        if (this.host() !== null) {
            if (this.protocol() !== null) {
                result += this.protocol() + '://';
            }
            result += this.host();
            if (this.port() !== null) {
                result += ':' + this.port();
            }
            result += '/';
        }
        return result;
    },

    toString: function() {
        var result = '';
        result += this.completeHost();
        result += this._pathParts.join('/');
        return result;
    },

    protocol: helpers.accessor('protocol'),

    host: helpers.accessor('host'),

    port: helpers.accessor('port')
});

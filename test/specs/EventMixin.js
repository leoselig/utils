var Clazz = require('../../src/Clazz');
var EventMixin = require('../../src/EventMixin');
var EventClass = Clazz.extend({}).mixin(EventMixin);

describe('utils/EventMixin', function() {

    var eventObj;

    beforeEach(function() {
        eventObj = new EventClass();
    });

    it('emits events without listeners intialized', function() {
        eventObj.emit('test');
    });

});

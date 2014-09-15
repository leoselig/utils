var helpers = require('../../src/helpers');
var sinon = require('sinon');

describe('utils/helpers', function() {

    it('containsAny()', function() {
        helpers.containsAny([1, 2, 3], [4, 5, 2, 7]).should.be.exactly(true);
    });

    it('rotate()', function() {
        helpers.rotate(0, 0, 3).should.be.exactly(1);
        helpers.rotate(3, 0, 3).should.be.exactly(0);
    });

    describe('accessor()', function() {

        var obj;
        var changeSpy;

        beforeEach(function() {
            changeSpy = sinon.spy();
            obj = {

                _prop: 1,

                prop: helpers.accessor('prop', changeSpy)

            };
        });

        it('gets the value', function() {
            obj.prop().should.be.exactly(obj._prop);
            changeSpy.called.should.be.exactly(false);
        });

        it('sets the value', function() {
            obj.prop().should.be.exactly(obj._prop);
            obj.prop('abc').prop().should.be.exactly('abc');
            changeSpy.calledOnce.should.be.exactly(true);
        });

        it('sets undefined', function() {
            var notDefined;
            (obj.prop(notDefined).prop() === notDefined).should.be.exactly(true, 'undefined value not set');
        });

        it('notifies on changes', function() {
            obj.prop().should.be.exactly(obj._prop);
            obj.prop('abc');
            changeSpy.calledOn(obj).should.be.exactly(true, 'this scope not set correctly');
            changeSpy.calledWith('abc').should.be.exactly(true, 'new value not passed');
        });

    });

});

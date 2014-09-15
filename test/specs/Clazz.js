var Clazz = require('../../src/CLazz');

describe('utils/Clazz', function() {
    var A, B, C;

    beforeEach(function() {
        A = Clazz.extend({
            test: function() {
                return 'a';
            }
        });
        B = A.extend({
            test: function() {
                return this.callSuper(arguments) + 'b';
            }
        });
        C = B.extend({
            test: function() {
                return this.callSuper(arguments) + 'c';
            }
        });
    });

    it('sets up prototype chain correctly', function() {
        new A().should.be.an.instanceOf(Clazz);
        new B().should.be.an.instanceOf(Clazz);
        new C().should.be.an.instanceOf(Clazz);
    });

    it('calls super method through multiple levels', function() {
        new C().test().should.equal('abc');
    });

});

var bundle = require('../../src/bundle');

describe('bundle', function() {

    it('bundles up at least main modules with global exposure', function() {
        bundle.Clazz.should.be.type('function');
    });

});


var vows = require('vows'),
    assert = require('assert'),
    Flocks = require('../lib/flocks.js');

// Create a Test Suite
vows.describe('Enforcement clauses').addBatch({
    'enforceString': {
        'doesn\'t throw pos': function (topic) {
            assert.doesNotThrow (function () { Flocks.enforceString('abc'); }, Error);
        },
        'throws neg': function (topic) {
            assert.throws (function () { Flocks.enforceString(234); }, 'Argument must be a string');
        }
    },
    'but when dividing zero by zero': {
        topic: function () { return 0 / 0; },

        'we get a value which': {
            'is not a number': function (topic) {
                assert.isNaN (topic);
            },
            'is not equal to itself': function (topic) {
                assert.notEqual (topic, topic);
            }
        }
    }
}).export(module);
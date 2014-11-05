
var vows = require('vows'),
    assert = require('assert'),
    Flocks = require('../lib/flocks.js');





function Negify(Func, ReqResult, ArgList) {

    var Res = {};

    Object.keys(ArgList).map(function (AK) {
        Res[AK] = function(topic) {
            assert.throws(function() { Func(ArgList[AK]) }, ReqResult)
        };
    });

    return Res;

}





function Posify(Func, ArgList) {

    var Res = {};

    Object.keys(ArgList).map(function (AK) {
        Res[AK] = function(topic) {
            assert.doesNotThrow(function() { Func(ArgList[AK]) }, undefined)
        };
    });

    return Res;

}





vows.describe('Enforcement clauses').addBatch({

    'enforceString': {
        'working normally': Posify(Flocks.enforceString, {
            'hello world'  : 'hello world',
            'empty string' : '',
            'unicode'      : '\u62b5\u5f92'
        }),

        'catching': Negify(Flocks.enforceString, 'Argument must be a string', {
            'throws neg for booleans'  : true,
            'throws neg for integers'  : 123,
            'throws neg for floats'    : 12.3,
            'throws neg for arrays'    : ['a',1],
            'throws neg for objects'   : {a:1},
            'throws neg for null'      : null,
            'throws neg for undefined' : undefined,
            'throws neg for functions' : function(X) { return 2; }
        })
    },






    'enforceArray': {
        'working normally': Posify(Flocks.enforceArray, {
            '[1,2,3]'         : [1,2,3],
            'empty array'     : [],
            '[1,\'2\',false]' : [1,'2',false]
        }),

        'catching': Negify(Flocks.enforceArray, 'Argument must be an array', {
            'throws neg for strings'   : 'string',
            'throws neg for booleans'  : true,
            'throws neg for integers'  : 123,
            'throws neg for floats'    : 12.3,
            'throws neg for objects'   : {a:1},
            'throws neg for null'      : null,
            'throws neg for undefined' : undefined,
            'throws neg for functions' : function(X) { return 2; }
        })
    },






    'enforceNonArrayObject': {
        'working normally': Posify(Flocks.enforceNonArrayObject, {
            '{hello:\'world\'}' : {hello: 'world'},
            'empty object'      : {},
            'null'              : null
        }),

        'catching': Negify(Flocks.enforceNonArrayObject, 'Argument must be a non-array object', {
            'throws neg for strings'   : 'string',
            'throws neg for arrays'    : ['a',1],
            'throws neg for booleans'  : true,
            'throws neg for integers'  : 123,
            'throws neg for floats'    : 12.3,
            'throws neg for undefined' : undefined,
            'throws neg for functions' : function(X) { return 2; }
        })
    }

}).export(module);

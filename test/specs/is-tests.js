
/* jshint node: true */
/* eslint-env node */

"use strict";

var th     = require("./_test_helper.js"),

    vows   = require("vows"),
    assert = require("assert"),
    verify = require("jsverify"),
    flocks = require("../../lib/flocks.jsx");





vows.describe("Type identification clauses").addBatch({



  'isArray' : {

    'Positive': {
      'empty'            : function(topic) { assert.equal (flocks.isArray( []              ), true); },
      'int non-empty'    : function(topic) { assert.equal (flocks.isArray( [1,2]           ), true); },
      'mixed non-empty'  : function(topic) { assert.equal (flocks.isArray( ['1',2.0,false] ), true); },
      'nested non-empty' : function(topic) { assert.equal (flocks.isArray( [[],[]]         ), true); },

      'property ?array x100' : function(topic) { verify.assert(
        verify.forall(verify.array(), function(mA) {
          return flocks.isArray(mA);
        })
      ); }

    },

    'Negative': {
      'object' : function(topic) { assert.equal (flocks.isArray( {a:[]} ), false); },
      'int'    : function(topic) { assert.equal (flocks.isArray( 1      ), false); },
      'bool'   : function(topic) { assert.equal (flocks.isArray( false  ), false); },
      'string' : function(topic) { assert.equal (flocks.isArray( '[]'   ), false); }
    }

  },



  'isNonArrayObject' : {

    'Positive': {
      'empty'            : function(topic) { assert.equal (flocks.isNonArrayObject( {}              ), true); },
      'int non-empty'    : function(topic) { assert.equal (flocks.isNonArrayObject( {i:2}           ), true); },
      'mixed non-empty'  : function(topic) { assert.equal (flocks.isNonArrayObject( {o:2.0,a:false} ), true); },
      'nested non-empty' : function(topic) { assert.equal (flocks.isNonArrayObject( {e:{g:{d:'o'}}} ), true); }

    },

    'Negative': {
      'array'     : function(topic) { assert.equal (flocks.isNonArrayObject( []        ), false); },
      'a of o'    : function(topic) { assert.equal (flocks.isNonArrayObject( [{}]      ), false); },
      'int'       : function(topic) { assert.equal (flocks.isNonArrayObject( 3         ), false); },
      'undefined' : function(topic) { assert.equal (flocks.isNonArrayObject( undefined ), false); }
    }

  },


  'isStringOfNonNegInt' : {

    'Positive': {
      '0'        : function(topic) { assert.equal (flocks.isStringOfNonNegInt('0'),        true); },
      '1'        : function(topic) { assert.equal (flocks.isStringOfNonNegInt('1'),        true); },
      '234'      : function(topic) { assert.equal (flocks.isStringOfNonNegInt('234'),      true); },
      '56789021' : function(topic) { assert.equal (flocks.isStringOfNonNegInt('56789021'), true); }
    },

    'Negative': {
      '-1'  : function(topic) { assert.equal (flocks.isStringOfNonNegInt('-1'),  false); },
      '+1'  : function(topic) { assert.equal (flocks.isStringOfNonNegInt('+1'),  false); },
      '00'  : function(topic) { assert.equal (flocks.isStringOfNonNegInt('00'),  false); },
      '01'  : function(topic) { assert.equal (flocks.isStringOfNonNegInt('01'),  false); },
      '1.0' : function(topic) { assert.equal (flocks.isStringOfNonNegInt('1.0'), false); }
    }

  },


  'isUndefined' : {

    'Positive': {
      'undefined' : function(topic) { assert.equal (flocks.isUndefined( undefined ), true); }
    },

    'Negative': {
      'int'    : function(topic) { assert.equal (flocks.isUndefined( 4 ),            false); },
      'string' : function(topic) { assert.equal (flocks.isUndefined( "string" ),     false); },
      'array'  : function(topic) { assert.equal (flocks.isUndefined( ['ar','ray'] ), false); },
      'object' : function(topic) { assert.equal (flocks.isUndefined( {obj:'ect'} ),  false); },
      'false'  : function(topic) { assert.equal (flocks.isUndefined( false ),        false); },
      'null'   : function(topic) { assert.equal (flocks.isUndefined( null ),         false); }
    }

  }



}).export(module);

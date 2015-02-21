
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

      '+ property'       : function(topic) { verify.assert(
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

  }

}).export(module);

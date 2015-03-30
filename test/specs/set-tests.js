
/* jshint node: true */
/* eslint-env node */

"use strict";

var th     = require("./_test_helper.js"),

    vows   = require("vows"),
    assert = require("assert"),
    verify = require("jsverify"),
    flocks = require("../../lib/flocks.jsx");





vows.describe("set/2").addBatch({



  'string key' : {

    'which did not exist' : function(topic) {
    }

/*
    'empty'            : function(topic) { assert.equal (flocks.isArray( []              ), true); },
    'int non-empty'    : function(topic) { assert.equal (flocks.isArray( [1,2]           ), true); },
    'mixed non-empty'  : function(topic) { assert.equal (flocks.isArray( ['1',2.0,false] ), true); },
    'nested non-empty' : function(topic) { assert.equal (flocks.isArray( [[],[]]         ), true); },

    'property ?array x100' : function(topic) { verify.assert(
      verify.forall(verify.array(), function(mA) {
        return flocks.isArray(mA);
      })
    ); }
*/

  }

});

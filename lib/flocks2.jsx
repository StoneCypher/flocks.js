/** @jsx React.DOM */
/* jshint node: true, browser: true, newcap: false */

/**
 * The Flocks library module.
 *
 * @module Flocks
 * @main   Flocks
 */





// if it's in a <script> it's defined already
// otherwise assume commonjs

if (typeof React === 'undefined') {
    var React = require('react');
}





// wrap the remainder

(function() {





    'use strict';





    var initialized  = false,
        updateBlocks = 0,
        dirty        = false,

        handler      = function() { return true; },
        finalizer    = function() { return true; },

        prevProps    = {},
        nextProps    = {};





    function flocksLog(X) {
        console.log(X);  // later make this disableable, whargarbl
    }





    function clone(obj, loglabel) {

        flocksLog( ' + Flocks2 cloning ' + (loglabel? loglabel : JSON.stringify(obj).substring(0,100) ) );

        if ((null === obj) || ('object' != typeof obj)) { return obj; }

        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) { copy[attr] = obj[attr]; }
        }

        return copy;

    }





    function attemptUpdate() {

        flocksLog(' - Flocks2 attempting update');
        dirty = true;

        if (!(initialized)) {
            flocksLog(' x Flocks2 skipped update: root is not initialized');
            return null;
        }

        if (updateBlocks) {
            flocksLog(' x Flocks2 skipped update: lock count updateBlocks is non-zero');
            return null;
        }

        if (!(handler(nextProps))) {
            flocksLog('   ! Flocks2 rolling back update: handler rejected propset');
            nextProps = prevProps;
            dirty = false;
            return null;
        }

        flocksLog('   - Flocks2 update passed');
        React.render( React.createFactory(GH2)( {flocks2context: nextProps} ), document.body );
        dirty = false;

        flocksLog('   - Flocks2 update complete; finalizing');
        finalizer();
        return true;

    }





    function create(Options) {

        var FlocksConfig = Options.flocks_config || {},
            FlocksData   = Options.flocks_data   || {},
            InitialProps = Options.initial_props || {},

            target       = FlocksConfig.target || document.body,
            control      = FlocksConfig.control,
            stub         = function() { window.alert('whargarbl stub'); },
            updater      = { get: stub, set: stub, override: stub, clear: stub, update: stub, lock: stub, unlock: stub };

        nextProps        = InitialProps;

        flocksLog('Flocks2 root creation begins');

        if (!(control))             { throw 'Flocks2 fatal error: must provide a control in create/2 FlocksConfig'; }
        if (FlocksConfig.handler)   { handler   = FlocksConfig.handler;   flocksLog(' - Flocks2 handler assigned'  ); }
        if (FlocksConfig.finalizer) { finalizer = FlocksConfig.finalizer; flocksLog(' - Flocks2 finalizer assigned'); }

        if (FlocksConfig.preventAutoContext) {
            flocksLog(' - Flocks2 skipping auto-context');
        } else {
            flocksLog(' - Flocks2 engaging auto-context');
            InitialProps.flocks2context = clone(FlocksData);
        }

        flocksLog('Flocks2 creation finished; initializing');
        initialized = true;
        attemptUpdate();

        flocksLog('Flocks2 initialization finished');

        return updater;

    }





    var Mixin = {

        componentWillMount: function() {
            if (this.props.foo) { window.alert('woo'); }
            flocksLog(' - Flocks2 component will mount: ' + this.constructor.displayName);
            flocksLog(typeof this.props.flocks2context === 'undefined'? '   - No F2 Context' : '   - F2 Context found');
        }

    };





    var exports = {

        member                : Mixin,
        create                : create,
        clone                 : clone,
/*
        isArray               : isArray,
        isNonArrayObject      : isNonArrayObject,
        enforceString         : enforceString,
        enforceArray          : enforceArray,
        enforceNonArrayObject : enforceNonArrayObject
*/
    };





    if (typeof module !== 'undefined') {
        module.exports = exports;
    } else {
        window.flocksjs2 = exports;
    }





}());

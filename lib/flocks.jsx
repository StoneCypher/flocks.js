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

        tagtype      = undefined,

        handler      = function() { return true; },
        finalizer    = function() { return true; },

        prevFCtx     = {},
        nextFCtx     = {},

        flocks2_ctxs = { flocks2context: React.PropTypes.object };





    function flocksLog(X) {
//      console.log(X);  // later make this disableable, whargarbl
    }





    function enforceString(On, Label) {
        Label = Label || 'Argument must be a string';
        if (typeof On !== 'string') {
            throw Label;
        }
    }





    function isArray(maybeArray) {

        return (Object.prototype.toString.call(maybeArray) === '[object Array]');

    }





    function isNonArrayObject(maybeArray) {

        if (typeof maybeArray !== 'object')                                  { return false; }
        if (Object.prototype.toString.call(maybeArray) === '[object Array]') { return false; }

        return true;

    }





    function setByKey(Key, MaybeValue) {
        enforceString(Key, "Flocks2 set/2 must take a string for its key");
        nextFCtx[Key] = MaybeValue;
        flocksLog("   - Flocks2 setByKey \"" + Key + "\"");
        attemptUpdate();
    }





    function setByPath(Key, MaybeValue) { flocksLog('   - Flocks2 setByPath stub'  ); attemptUpdate(); }
    function setByObject(Key, MaybeValue) { flocksLog('   - Flocks2 setByObject stub'); attemptUpdate(); }

    function set(Key, MaybeValue) {

        flocksLog(' - Flocks2 multi-set');

        if      (typeof Key === 'string') { setByKey(Key, MaybeValue); }
        else if (isArray(Key))            { setByPath(Key, MaybeValue); }
        else if (isNonArrayObject(Key))   { setByObject(Key); }
        else                              { throw 'Flocks2 set/1,2 key must be a string or an array'; }

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
/*
        if (deepCompare(nextFCtx, prevFCtx)) {
            flocksLog(' x Flocks2 skipped update: no update to state');
            return true;
        }
*/
        if (!(handler(nextFCtx))) {
            flocksLog('   ! Flocks2 rolling back update: handler rejected propset');
            nextFCtx = prevFCtx;
            dirty    = false;
            return null;
        }

        prevFCtx = nextFCtx;

        flocksLog('   - Flocks2 update passed');
        React.render( React.createFactory(tagtype)( { flocks2context: nextFCtx } ), document.body );
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
            stub         = function() { window.alert('whargarbl stub'); attemptUpdate(); },
            updater      = { get: stub, set: set, override: stub, clear: stub, update: stub, lock: stub, unlock: stub };

        tagtype          = FlocksConfig.control,
        nextFCtx         = FlocksData;

        flocksLog('Flocks2 root creation begins');

        if (!(tagtype))             { throw 'Flocks2 fatal error: must provide a control in create/2 FlocksConfig'; }
        if (FlocksConfig.handler)   { handler   = FlocksConfig.handler;   flocksLog(' - Flocks2 handler assigned'  ); }
        if (FlocksConfig.finalizer) { finalizer = FlocksConfig.finalizer; flocksLog(' - Flocks2 finalizer assigned'); }

        if (FlocksConfig.preventAutoContext) {
            flocksLog(' - Flocks2 skipping auto-context');
        } else {
            flocksLog(' - Flocks2 engaging auto-context');
            this.fctx = clone(nextFCtx);
        }

        flocksLog('Flocks2 creation finished; initializing');
        initialized = true;
        attemptUpdate();

        flocksLog('Flocks2 expose updater');
        this.fupd = updater;
        this.fset = updater.set;

        flocksLog('Flocks2 initialization finished');

        return updater;

    }





    var Mixin = {

        contextTypes      : flocks2_ctxs,
        childContextTypes : flocks2_ctxs,

        componentWillMount: function() {

            flocksLog(' - Flocks2 component will mount: ' + this.constructor.displayName);
            flocksLog(typeof this.props.flocks2context   === 'undefined'? '   - No F2 Context Prop' : '   - F2 Context Prop found');
            flocksLog(typeof this.context.flocks2context === 'undefined'? '   - No F2 Context'      : '   - F2 Context found');

            if (this.props.flocks2context) {
                this.context.flocks2context = this.props.flocks2context;
            }

            this.fset = function(X,Y) { set(X,Y); };
            this.fctx = this.context.flocks2context;

        },

        getChildContext: function() {
            return this.context;
        }


    };





    var exports = {

        member                : Mixin,
        create                : create,
        clone                 : clone,

        isArray               : isArray,
        isNonArrayObject      : isNonArrayObject,

        enforceString         : enforceString,
/*
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

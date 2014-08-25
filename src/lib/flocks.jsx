/** @jsx React.DOM */
/* jshint node: true */

'use strict';

var React = require('react'),

    flContextTypes = {
        root : React.PropTypes.object,
        depth : React.PropTypes.number,
        updateFunc: React.PropTypes.func.isRequired
    },

    Mixin = {

        contextTypes: flContextTypes,
        childContextTypes: flContextTypes,

        getChildContext: function() {

            var defaultingContext = {};
            for (var i in flContextTypes) {
                // root is a special case; so is depth
                if ((i !== 'root') && (i !== 'depth')) {
                    defaultingContext[i] = (this.props[i] !== undefined)? this.props[i] : this.context[i];
                }
            }

            // root auto-handles self-if-no-parent
            defaultingContext['root'] = ((this.context['root'] === undefined)? this : this.context['root']);

            // root auto-handles depth too
            defaultingContext['depth'] = ((this.context['depth'] === undefined)? 0 : this.context['depth']+1);

            return defaultingContext;

        }
    },

    create = function(TargetTag, RenderDescriptor) {

        var CurrentData    = {},
            UpdatesBlocked = false,
            UpdateIfWanted = function() {
                console.log('typeof TargetTag ' + typeof TargetTag);
                React.renderComponent(RenderDescriptor(CurrentData), TargetTag);
            };

        // todo whargarbl what're docs lol

        // there are five call patterns to this function
        // all changes are immediate unless updates are blocked
        // it is expected that 5 will be used for initialization and 4 primarily for updates

        // 1 [null,           _:_]                - clear the flocks current data object.
        // 2 [false,          _:_]                - block flock updates (useful for batch updating w/o thrashing)
        // 3 [true,           _:_]                - unblock flock updates
        // 4 [request:string, maybeValue:defined] - update this key to this maybeValue
        // 5 [request:object, _:undefined]        - update all these keys to their values

        return function(Request, maybeValue) {

            if (Request === null) {
                CurrentData = {};
                UpdateIfWanted();
                return;
            }

            if (Request === false) {
                UpdatesBlocked = true;
                return;
            }

            if (Request === true) {
                UpdatesBlocked = false;
                UpdateIfWanted();
                return;
            }

            if (typeof Request === 'string') {
                CurrentData[Request] = maybeValue;
                UpdateIfWanted();
                return;
            }

            if (typeof Request === 'object') {

                if (toString.call(obj) === "[object Array]") {
                    throw 'First argument to re-flock must be a plain object, a string, true, false, or null.  Received an array.';
                }

                for (var i in Request) {
                    CurrentData[i] = Request[i];
                }

                UpdateIfWanted();
                return;
            }

            throw 'First argument to re-flock must be a plain object, a string, true, false, or null.  Received an unhandled type "' + (typeof Request) + '".';

        };

    };



module.exports = {

    member: Mixin,
    create: create

};
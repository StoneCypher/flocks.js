/** @jsx React.DOM */
/* jshint node: true */
'use strict';

var React = require('react'),

    Mixin = {
        contextTypes: { updateFunc: React.PropTypes.func },
        childContextTypes: { updateFunc: React.PropTypes.func },
        getChildContext: function() { return { updateFunc: this.context.updateFunc }; }
    },

    create = function(TargetTag, RenderDescriptor) {
        var CurrentData = {};
        return function(Field, NewData) {

        };
    };

module.exports = {

    member: Mixin,
    create: function() { return 2+2; }

};

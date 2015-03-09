YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "flocks",
        "gulpfile",
        "plumbing"
    ],
    "modules": [
        "flocks",
        "gulpfile"
    ],
    "allModules": [
        {
            "displayName": "flocks",
            "name": "flocks",
            "description": "The Flocks library module.  Load this module and use either the\nflocks <tt>flocks.createClass</tt> wrapper or the <tt>flocks plumbing</tt>\nmixin to create <tt>flocks controls</tt>.  Place them into your document\nusing <tt>flocks.mount</tt>, and use the returned function or the data and\nmethod that the mixin provides, <tt>this.fctx</tt> and <tt>this.fset()</tt>\nrespectively, to read and write to the <tt>flocks state</tt>.\n\nAnd suddenly you're done.\n\nPlease see the <a href=\"http://flocks.rocks/what_is_flocks.html\" target=\"_blank\">tutorials</a>\nfor more information."
        },
        {
            "displayName": "gulpfile",
            "name": "gulpfile",
            "description": "Flocks gulpfile."
        }
    ]
} };
});
(function(root, factory) {
    
    if (typeof define === 'function' && define.amd) {
        
        define(['backbone', 'underscore', 'backbone.paginator'], function(Backbone, Underscore, PageableCollection) {

            return (root.Hal = factory(root, Backbone, _, PageableCollection));

        });
    
    }
  
    else if (typeof exports !== 'undefined') {
    
        var Backbone = require('backbone');
        var _ = require('underscore');
        var PageableCollection = require('backbone.paginator');
        
        module.exports = factory(root, Backbone, _, PageableCollection);

    }
    
    else {
    
        root.Hal = factory(root, root.Backbone, root._, root.PageableCollection);
    
    }
    
}(this, function(root) {

    'use strict';
    
    /**
     * @namespace Hal
     */
    var Hal = {};

    // @include link.js
    // @include model.js
    // @include collection.js

    return Hal;

}));

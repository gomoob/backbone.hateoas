(function(root, factory) {
    
    if (typeof define === 'function' && define.amd) {
        
        define(['backbone', 'underscore', 'backbone.paginator'], function(Backbone, Underscore, PageableCollection) {

            Backbone.PageableCollection = PageableCollection;
            
            return (root.Hal = factory(root, Backbone, _));

        });
    
    }
  
    else if (typeof exports !== 'undefined') {
    
        var Backbone = require('backbone');
        var _ = require('underscore');
        Backbone.PageableCollection = require('backbone.paginator');
        
        module.exports = factory(root, Backbone, _);

    }
    
    else {
    
        root.Hal = factory(root, root.Backbone, root._);
    
    }
    
}(this, function(root, Backbone, _) {

    'use strict';
    
    /**
     * @namespace Hal
     */
    var Hal = {};

    // @include link/link.js
    // @include link/link-array.js
    // @include link/links.js
    // @include model.js
    // @include collection.js

    return Hal;

}));

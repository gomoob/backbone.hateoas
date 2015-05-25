(function(root, factory) {
    
    if (typeof define === 'function' && define.amd) {
        
        define([], function() {

            return (root.WidgetFactory = factory(root));

        });
    
    }
  
    else if (typeof exports !== 'undefined') {
    
        module.exports = factory(root);

    }
    
    else {
    
        root.WidgetFactory = factory(root);
    
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

    return WidgetFactory;

}));

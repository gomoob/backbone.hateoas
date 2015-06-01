/**
 * Backbone collection which represents a set of HAL Links.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
Hal.LinkArray = Backbone.Collection.extend(
    {
        isArray : function() {

            return true;

        }
    }
);
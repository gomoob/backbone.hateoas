/** 
 * Backbone model which represents an HAL Model, an HAL Model is a Backbone Model with additional '_embedded' and 
 * '_links' properties.
 * 
 * Links can be accessed using the following methods : 
 *   - model.get('_links').get('linkName')
 *   - model.getLink('linkName')
 *   
 * Embedded resources can be accessed using the following methods : 
 *   - model.get('_embedded').get('attributeName')
 *   - model.getEmbedded('attributeName')
 *   - model.get('attributeName')
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */ 
Hal.Model = Backbone.Model.extend({

    _links : null,
    
    _embedded : null,
    
    /**
     * Function used to initialize the HAL model.
     * 
     * @param {Object} options Options used to initialize the HAL model.
     */
    initialize : function(options) {
    
        var _options = options || {};
        
        // Initialize '_links'
        this._links = new Hal.Links(_options._links);

        // Initialize '_embedded'
        this._embedded = new Hal.Embedded(_options._embedded, this.embedded);

    },
    
    getEmbedded : function(rel) {

        var ret = this._embedded;

        if(_.isString(rel)) {
           
            ret = ret.get(rel);
            
        }
        
        return ret;

    },

    /**
     * Utility function used to get a HAL link by relation name.
     * 
     * @param {String} rel The name of the relation used to retrieve the link.
     * 
     * @retunr {Hal.Link | Hal.LinkArray} A link a link array associated to the relation name.
     */
    getLink : function(rel) {

        return this.getLinks().get(rel);

    }, 

    /**
     * Utility function used to retrieve all the associated HAL links.
     * 
     * @return {Hal.Links} An object which represents the HAL links associated to this model.
     */
    getLinks : function() {

        return this._links;

    },

    toJSON : function() {
        
        var noLinks = _.isEmpty(this.getLinks().attributes), 
            noEmbedded = _.isEmpty(this.getEmbedded().attributes), 
            cloned = null;
        
        if(noLinks && noEmbedded) {
            
            cloned = _.clone(_.omit(this.attributes, '_links', '_embedded'));
            
        } else if(noLinks) {
            
            cloned = _.clone(_.omit(this.attributes, '_links'));
            
        } else if(noEmbedded) {
            
            cloned = _.clone(_.omit(this.attributes, '_embedded'));
            
        } else {
            
            cloned = _.clone(this.attributes);
            
        }
        
        return cloned;

    },
    
    /**
     * Returns the URL where the model's resource is located on the server, this method has the same behavior as the 
     * Backbone one except it will use the value of the `self` link if a `self` link exists. 
     * 
     * If no `self` link exists this function will have the same behavior as the Backbone url method.
     * 
     * @return {String} The URL where the model's resource is located on the server.
     */
    url : function() {

        // If the HAL Resource has a 'self' link we use it
        if(this.getLinks().hasSelf()) {

            return this.getLinks().getSelf();

        } 
        
        // Otherwise we use the Backbone.Model.url() method
        else {

            return Backbone.Model.prototype.url.call(this);

        }
        
    }

});

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

    /**
     * Function used to initialize the HAL model.
     * 
     * @param {Object} options Options used to initialize the HAL model.
     */
    initialize : function(options) {
    
        // If options are provided
        if(options) {
            
            // Initialize '_links'
            if(options._links) {
                
                this.set('_links', new Hal.Links(options._links));
                
            }
            
            // Initialize '_embedded'
            // TODO:
            
        }
        
    },
    
    getEmbedded : function(rel) {

        return this.get('_embedded').get(rel);

    },

    /**
     * Utility function used to get a HAL link by relation name.
     * 
     * @param {String} rel The name of the relation used to retrieve the link.
     * 
     * @retunr {Hal.Link | Hal.LinkArray} A link a link array associated to the relation name.
     */
    getLink : function(rel) {

        return this.get('_links').get(rel);

    }, 

    /**
     * Utility function used to retrieve all the associated HAL links.
     * 
     * @return {Hal.Links} An object which represents the HAL links associated to this model.
     */
    getLinks : function() {

        return this.get('_links');

    },
    
    parse : function(resp, options) {

        // Create a response without the '_links' and '_embedded' properties
        var parsed = _.omit(resp, '_links', '_embedded');

        // HTTP PATCH with no content is allowed.
        if(options.patch && _.size(parsed) === 0) {

            return parsed;
            
        }
        
        // Parse the embedded resources
        parsed._embedded = new Hal.Model();
        _.map(
            resp._embedded,
            function(resource, attributeName) {

                var halObject = null;
                
                // If the '_embedded' resource is an array this is a potential Hal Collection
                if(_.isArray(resource)) {
                    
                    // If the current model class defines a specific configuration for the attached embedded resource
                    if(this.hal && this.hal[attributeName]) {
                        
                        var CollectionClass = this.hal[attributeName].type;
                        
                        halObject = new CollectionClass(
                            resource, 
                            {
                                mode : 'server', 
                                model: this.hal[attributeName].model,
                                
                                // WARNING: This is very important to force Backbone to call the Hal.Model.parse method 
                                //          on embedded resources too. 
                                parse : true
                            }
                        );

                    } 
                    
                    // Otherwise we use a default configuration
                    else {
                    
                        halObject = new Backbone.Collection(
                            resource, 
                            { 
                                mode : 'server',
                                model : Hal.Model,
                                
                                // WARNING: This is very important to force Backbone to call the Hal.Model.parse method 
                                //          on embedded resources too.
                                parse : true
                            }
                        );

                    }
                        
                } 
                
                // Otherwise the attached embedded resource is a simple model
                else {

                    halObject = new Hal.Model(resource, { parse : true });
                    
                }
                
                parsed._embedded.set(attributeName, halObject);
                this.set(attributeName, halObject);
                
            }, 
            this
        );
        
        // Parse the links
        parsed._links = new Hal.Links(resp._links);
        
        return parsed;

    },
    
    toJSON : function(options) {

        // Create a response without the '_links' and '_embedded' properties
        var object = _.omit(this.attributes, '_links', '_embedded'),
            halObject = {};
            
        halObject._embedded = {};
        halObject._links = {};
        
        _.each(object, function(value, key) {
           
            if(_.isArray(value)) {
                
                halObject[key] = [];
                
                _.each(value, function(value, index) {
                  
                    if(_.isObject(value) && value instanceof Backbone.Collection) {
                        
                        halObject[key].push(value.toJSON());
                        
                    }
                    
                    else {
                        
                        halObject[key] = value;
                        
                    }
                    
                });
                
            }
            
            else if(_.isObject(value)) {
                
                if(value instanceof Backbone.Model || value instanceof Backbone.Collection) {
                    
                    halObject[key] = value.toJSON();
                    
                } 
                
            }
            
            else {
                
                halObject[key] = value;
                
            }
            
        });
        
        if(_.has(this.attributes, '_embedded')) {
        
            var _embedded = this.attributes._embedded;
            
            _.each(_embedded.attributes, function(value, key) {
               
                if(value instanceof Backbone.Model || value instanceof Backbone.Collection) {
                    halObject._embedded[key] = value.toJSON();
                }
                
            });
            
        }
        
        if(_.has(this.attributes, '_links')) {
        
            var _links = this.attributes._links;
            
            _.each(_links.attributes, function(value, key) {
               
                if(value instanceof Backbone.Model) {
                    halObject._links[key] = {
                        href : value.get('href')
                    };
                }
                
            });
            
        }
        
        return halObject;        
    },
    
    url : function() {
        
        if(this.get('_links') && this.get('_links').get('self') && this.get('_links').get('self').get('href')) {
            
            return this.get('_links').get('self').get('href');
            
        } else {

            return Backbone.Model.prototype.url.call(this);

        }
        
    }

});

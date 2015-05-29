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
    
    getLink : function(linkName) {

        return this.get('_links').get(linkName);

    }, 
    
    getLinks : function() {
        
        return this.get('_links');
        
    }

});

Hal.Model.prototype.getEmbedded = function(embeddedName) {

    return this.get('_embedded').get(embeddedName);

};

Hal.Model.prototype.url = function() {
    
    if(this.get('_links') && this.get('_links').get('self') && this.get('_links').get('self').get('href')) {
        
        return this.get('_links').get('self').get('href');
        
    } else {
        
        if(!this.halResourceName) {
            
            throw new Error('A \'halResourceName\' parameter is required !');
            
        }
        
        var url = this.urlRoot;
        
        if(this.urlRoot.slice(-1) !== '/') {
            
            url += '/';
            
        }
        
        url += this.halResourceName;
    
        if (this.has('id')) {

            url = url + '/' + this.get('id');

        }
        
        if(this.queryParams) {
            
            url = url + '?' + $.param(this.queryParams);
            
        }

        return url;
        
    }
    
};
Hal.Model.prototype.parse = function(resp, options) {

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
    parsed._links = new Hal.Model();
    _.map(
        resp._links, 
        function(link, linkName) {
            
            parsed._links.set(linkName, new Hal.Link(link));

        },
        this
    );
    
    return parsed;

};

Hal.Model.prototype.toJSON = function(options) {
    
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
};
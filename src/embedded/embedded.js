/**
 * Backbone model which represents a set of embedded resources.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-4.1.2
 */
Hal.Embedded = Backbone.Model.extend(
    {
        /**
         * Function used to initialize the links.
         * 
         * @param {Object} options Options used to initialize the links.
         * @param {Object} embedded An object which maps HAL relation types to model classes the `_embedded` contains, 
         *        the purpose of this property is the same as the Backbone.Collection `model` property except it defines 
         *        a model class for each embedded resource.
         */
        initialize : function(attributes, options) {

            _.map(
                attributes, 
                function(embeddedResource, rel) {

                    var halResource = null;
                    
                    // If 'embedded' is provided then we try to find a specified model or collection class
                    if(this.embedded) {

                        // The embedded resource is created using a function
                        if(_.isFunction(this.embedded[rel])) {

                            halResource = this.embedded[rel](rel, embeddedResource, options);

                        } 
                        
                        // The embedded resource is created using an Hal Collection
                        else if(this.embedded[rel] instanceof Hal.Collection) {
                            
                            halResource = new Hal.Collection(embeddedResource);
                            
                        } 
                        
                        // The embedded resource is created using an Hal Model
                        else if(this.embedded[rel] instanceof Hal.Model) {
                            
                            halResource = new Hal.Model(embeddedResource);

                        } 
                        
                        // Otherwise this is an error
                        else {
                            
                            throw new Error(
                                'Invalid embedded model or collection class provided for \'rel\'=\'' + rel + '\' !'
                            ); 

                        }

                    } 
                    
                    // Otherwise if the '_embedded' resource is an array we consider it to be an Hal Collection
                    else if(_.isArray(embeddedResource)) {

                        halResource = new Hal.Collection(
                            embeddedResource, 
                            { 
                                mode : 'server',
                                model : Hal.Model
                            }
                        );
                        halResource.rel = rel;
                        
                    } 
                    
                    // Otherwise of the '_embedded' resourec is an object we consider it to be an Hal Model
                    else if(_.isObject(embeddedResource)) {

                        halResource = new Hal.Model(embeddedResource);
                        
                    } 
                    
                    // Otherwise this is an error
                    else {

                        throw new Error('Invalid embedded resource identified by \'rel\'=\'' + rel + '\' !');    

                    }

                    this.set(rel, halResource);

                },
                this
            );

        }
    }
);

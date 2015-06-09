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
//        initialize : function(attributes, options) {

            // FIXME: Doit être fait dans la méthode set(key, val, options) de la même manière que pour Hal.Model !!!
//            _.map(
//                attributes,
//                function(embeddedResource, rel) {
//
//                    var halResource = null;
//
//                    // If 'embedded' is provided then we try to find a specified model or collection class
//                    if(this.embedded) {
//
//                        // The embedded resource is created using a function
//                        if(_.isFunction(this.embedded[rel])) {
//
//                            halResource = this.embedded[rel](rel, embeddedResource, options);
//
//                        }
//
//                        // The embedded resource is created using an Hal Collection
//                        else if(this.embedded[rel] instanceof Hal.Collection) {
//
//                            halResource = new Hal.Collection(embeddedResource);
//
//                        }
//
//                        // The embedded resource is created using an Hal Model
//                        else if(this.embedded[rel] instanceof Hal.Model) {
//
//                            halResource = new Hal.Model(embeddedResource);
//
//                        }
//
//                        // Otherwise this is an error
//                        else {
//
//                            throw new Error(
//                                'Invalid embedded model or collection class provided for \'rel\'=\'' + rel + '\' !'
//                            );
//
//                        }
//
//                    }
//
//                    // Otherwise if the '_embedded' resource is an array we consider it to be an Hal Collection
//                    else if(_.isArray(embeddedResource)) {
//
//                        halResource = [];
//
//                        _.each(embeddedResource, function(el) {
//
//                            halResource.push(new Hal.Model(el));
//
//                        });
//
//                    }
//
//                    // Otherwise of the '_embedded' resourec is an object we consider it to be an Hal Model
//                    else if(_.isObject(embeddedResource)) {
//
//                        halResource = new Hal.Model(embeddedResource);
//
//                    }
//
//                    // Otherwise this is an error
//                    else {
//
//                        throw new Error('Invalid embedded resource identified by \'rel\'=\'' + rel + '\' !');
//
//                    }
//
//                    this.set(rel, halResource);
//
//                },
//                this
//            );

//        },

        /**
         * Set a hash of model attributes on the object, firing `"change"`. This is the core primitive operation of a
         * model, updating the data and notifying anyone who needs to know about the change in state. The heart of the
         * beast.
         *
         * @param {Object | String} A Javascript containing multiple key / value pairs to set or the name of a property
         *        to set.
         * @param {String | *} The value to associated to a key if the first parameter is a key, options otherwise.
         * @param {Object} options Options to be used when the first parameter is a key and the second one a value.
         *
         * @return {Hal.Model} This.
         */
        set: function(key, val, options) {

            var attrs;

            if (key === null) {

                return this;

            }

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (typeof key === 'object') {

                attrs = key;
                options = val;

            } else {

                (attrs = {})[key] = val;

            }

            _.map(
                attrs,
                function(embeddedResource, rel) {

                    // If the provided element is already a Hal.Model or a Hal.Collection we set it directly
                    if(embeddedResource instanceof Hal.Model || embeddedResource instanceof Hal.Collection) {

                        Backbone.Model.prototype.set.call(this, rel, embeddedResource);

                    }

                    // The current embedded resource is an array
                    else if(_.isArray(embeddedResource)) {

                        var array = [];

                        // For each embedded resource
                        for(var i = 0; i < embeddedResource.length; ++i) {

                            // If the array element is already an Hal.Model or Hal.Collection object we set it directly
                            if(embeddedResource[i] instanceof Hal.Model || embeddedResource[i] instanceof Hal.Collection) {

                                array.push(embeddedResource[i]);

                            }

                            // Otherwise we create an Hal.Model instance by default
                            else {

                                array.push(new Hal.Model(embeddedResource[i]));

                            }

                        }

                        Backbone.Model.prototype.set.call(this, rel, array);

                    }

                    // The current embedded resource is a plain HAL object
                    else if(_.isObject(embeddedResource)){

                        Backbone.Model.prototype.set.call(this, rel, new Hal.Model(embeddedResource));

                    }

                    // Null or undefined is authorized, in most case it is encounterd when the 'unset(attr)' method is
                    // called
                    else if(_.isNull(embeddedResource) || _.isUndefined(embeddedResource)) {

                        Backbone.Model.prototype.set.call(this, rel, embeddedResource);

                    }

                    // Otherwise this is an error
                    else {

                        throw new Error('Invalid embedded resource identified by \'rel\'=\'' + rel + '\' !');

                    }

                },
                this
            );

            return this;

        },

        /**
         * Function used to convert this `_embedded` into a Javascript object to be passed to `JSON.stringify(obj)`.
         *
         * @return {Object} The resulting object which MUST BE compliant with HAL.
         */
        toJSON : function() {

            var json = {};

            for(var rel in this.attributes) {

                var resource = this.attributes[rel];

                // If the embedded resource is an array then we convert each object
                // FIXME: Ici il faut pouvoir serialiser les collections Backbone également...
                if(_.isArray(resource)) {

                    json[rel] = [];

                    for(var i = 0; i < resource.length; ++i) {

                        json[rel].push(resource[i].toJSON());

                    }

                }

                // Otherwise we expect a Hal.Model
                else {

                    json[rel] = this.attributes[rel].toJSON();

                }

            }

            return json;

        }
    }
);

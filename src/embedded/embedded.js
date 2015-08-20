/**
 * Backbone model which represents a set of embedded resources.
 *
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-4.1.2
 */
Hal.Embedded = Backbone.Model.extend(
    {
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

                    // If the provided element is of type
                    //  - Backbone.Model
                    //  - Backbone.Collection
                    //  - Hal.Model
                    //  - Hal.Collection
                    // Then we set it directly
                    //
                    // FIXME: Il est bien de pouvoir utiliser des types Backbone classique, mais du coup ceux-ci ne vont
                    //        pas avoir les mêmes méthode que pour les tpes Hal. En fait il faudrait prévoir un
                    //        refactoring de la librairie pour étendre Backbone.Model comment le font les librairies
                    //        Backbone.Stickit ou Backbone.Validation
                    if(embeddedResource instanceof Backbone.Model ||
                       embeddedResource instanceof Backbone.Collection ||
                       embeddedResource instanceof Hal.Model ||
                       embeddedResource instanceof Hal.Collection) {

                        Backbone.Model.prototype.set.call(this, rel, embeddedResource, options);

                    }

                    // The current embedded resource is an array
                    else if(_.isArray(embeddedResource)) {

                        var array = [];

                        // For each embedded resource
                        for(var i = 0; i < embeddedResource.length; ++i) {

                            // If the provided element is of type
                            //  - Backbone.Model
                            //  - Backbone.Collection
                            //  - Hal.Model
                            //  - Hal.Collection
                            if(embeddedResource[i] instanceof Backbone.Model ||
                               embeddedResource[i] instanceof Backbone.Collection ||
                               embeddedResource[i] instanceof Hal.Model ||
                               embeddedResource[i] instanceof Hal.Collection) {

                                array.push(embeddedResource[i]);

                            }

                            // Otherwise we create an Hal.Model instance by default
                            else {

                                array.push(new Hal.Model(embeddedResource[i]));

                            }

                        }

                        Backbone.Model.prototype.set.call(this, rel, array, options);

                    }

                    // The current embedded resource is a plain Javascript object
                    else if(_.isObject(embeddedResource)){

                        Backbone.Model.prototype.set.call(this, rel, new Hal.Model(embeddedResource), options);

                    }

                    // Null or undefined are authorized
                    else if(_.isNull(embeddedResource) || _.isUndefined(embeddedResource)) {

                        Backbone.Model.prototype.set.call(this, rel, embeddedResource, options);

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
         * @param {Object} options (Optional) Options used to configure the behavior of the method.
         * @param {String} options.contentType (Optional) A content type to be used to create the representation, currently
         *        the method accepts 'application/json' (the default one) or 'application/hal+json'.
         *
         * @return {Object} The resulting object which MUST BE compliant with HAL.
         */
        toJSON : function(options) {

            var json = {},
                _options = options || {},
                contentType = _options.contentType || Hal.contentType || 'application/json';

            for(var rel in this.attributes) {

                var resource = this.attributes[rel];

                // Null or undefined are authorized, in most case it is encountered when the 'unset(attr)' method is
                // called
                if(_.isUndefined(resource) || _.isNull(resource)) {

                    json[rel] = resource;

                }

                // If the embedded resource is an array then we convert each object
                else if(_.isArray(resource)) {

                    json[rel] = [];

                    for(var i = 0; i < resource.length; ++i) {

                        // A embedded resource can be undefined or null, in that case we convert it in a null json value
                        if(_.isUndefined(resource[i]) || _.isNull(resource[i])) {

                            json[rel].push(resource[i]);

                        }

                        // Otherwise we expect a Hal.Model
                        else {

                            json[rel].push(resource[i].toJSON(_options));

                        }

                    }

                }

                // Otherwise we expect a Hal.Model
                // FIXME: Ici il se peut que l'on tombe également sur un des 2 types suivants :
                //  - Backbone.Model
                //  - Backbone.Collection
                //  - Hal.Collection
                else {

                    json[rel] = resource.toJSON(_options);

                }

            }

            return json;

        }
    }
);

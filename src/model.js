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
     * An object used to store the HAL `_links` attached to this HAL resource.
     *
     * @var {Hal.Links}
     */
    _links : null,

    /**
     * An object used to store the HAL `_embedded` attached to this HAL resource.
     *
     * @var {Hal.Embedded}
     */
    _embedded : null,

    /**
     * Utility function used to get all the `_embedded` resources attached to the model or a specific `_embedded`
     * resource.
     *
     * @param {String} rel (Optional) The name of a relation type used to retrieve a specific embedded resource.
     */
    getEmbedded : function(rel) {

        var ret = this._embedded;

        if(_.isString(rel)) {

            ret = ret.get(rel);

        }

        return ret;

    },

    /**
     * Remove an embedded resource by deleting it from the internal attributes hash. Fires a "change" event unless
     * silent is passed as an option.
     *
     * @param {String} rel The name of the relation type used to identify the embedded resource to unset.
     * @param {Object} options Options used to configure the unset operation.
     */
    unsetEmbedded : function(rel, options) {

        this.getEmbedded().unset(rel, options);

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

    /**
     * Function used to initialize the view.
     *
     * @param {Object} options Options used to initialize the view.
     */
    initialize : function(options) {

        // This check is required because the Backbone.Model constructor calls the `set(key, value, options)` method
        // before calling initialize. The `_links` can be set before initialize when the Hal.Model is directly
        // initialized with `_links`. Please also note that initializing the links in the `set(key, value, options)`
        // method is better because it will also be called on `fetch()`.
        if(!this._links) {

            this._links = new Hal.Links();

        }

        // This check is here for the same reasons as the previous condition
        if(!this._embedded) {

            this._embedded = new Hal.Embedded();

        }

    },

    /**
     * Function used to convert this model into a Javascript object to be passed to `JSON.stringify(obj)`.
     *
     * @return {Object} The resulting object which MUST BE compliant with HAL.
     */
    toJSON : function() {

        var noLinks = _.isEmpty(this.getLinks().attributes),
            noEmbedded = _.isEmpty(this.getEmbedded().attributes),
            cloned = null;

        // The Hal.Model has no '_links' and not '_embedded' so we do not inject them in the JSON object
        if(noLinks && noEmbedded) {

            cloned = _.clone(this.attributes);

        }

        // The Hal.Model has no '_links' and has at least one '_embedded' property
        else if(noLinks) {

            cloned = _.extend(this.attributes, {'_embedded' : this.getEmbedded().toJSON()});

        }

        // The Hal.Model has at least one link and no embedded resources
        else if(noEmbedded) {

            cloned = _.extend(this.attributes, {'_links' : this.getLinks().toJSON()});

        }

        // The Hal.Model has both links and embedded resources
        else {

            cloned = _.extend(
                _.clone(this.attributes),
                {
                    '_embedded' : this.getEmbedded().toJSON(),
                    '_links' : this.getLinks().toJSON()
                }
            );

        }

        return cloned;

    },

    /**
     * Set a hash of model attributes on the object, firing `"change"`. This is the core primitive operation of a model,
     * updating the data and notifying anyone who needs to know about the change in state. The heart of the beast.
     *
     * @param {Object | String} A Javascript containing multiple key / value pairs to set or the name of a property to
     *        set.
     * @param {String | *} The value to associated to a key if the first parameter is a key, options otherwise.
     * @param {Object} options Options to be used when the first parameter is a key and the second one a value.
     *
     * @return {Hal.Model} This.
     */
    set: function(key, val, options) {

        var attr, attrs, k;

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

        if(attrs._links) {

            if(!this._links) {

                this._links = new Hal.Links(attrs._links);

            } else {

                for(k in attrs._links) {

                    this._links.set(k, attrs._links[k]);

                }

            }

        }

        if(attrs._embedded) {

            if(!this._embedded) {

                this._embedded = new Hal.Embedded(attrs._embedded);

            } else {

                for(k in attrs._embedded) {

                    this._embedded.set(k, attrs._embedded[k]);

                }

            }


        }

        attrs = _.omit(attrs, '_links', '_embedded');

        return Backbone.Model.prototype.set.call(this, attrs, val, options);

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

            return this.getLinks().getSelf().getHref();

        }

        // Otherwise we use the Backbone.Model.url() method
        else {

            var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url'),
                halUrlRoot = _.result(Hal, 'urlRoot'),
                urlMiddle = _.result(this, 'urlMiddle');

            // Base could not be created using standard Backbone rules, if Hal.urlRoot is defined and is a string use it
            if(!base && _.isString(halUrlRoot)) {

                base = halUrlRoot;

                // If the Hal Model defines a 'urlMiddle' property we use it
                if(_.isString(urlMiddle)) {

                    base = base.replace(/([^\/])$/, '$1/') + encodeURIComponent(urlMiddle);

                }

            }

            // If we fail to create a base generates an error
            if(!base) {

                throw new Error('A "url" property or function must be specified');

            }

            // If the model is new (i.e has no identifier) returns the base directly
            if (this.isNew()) {

                return base;

            }

            var id = this.id || this.attributes[this.idAttribute];

            return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(id);

        }

    }

});

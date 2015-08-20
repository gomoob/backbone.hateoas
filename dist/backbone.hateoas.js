(function(root, factory) {

    if (typeof define === 'function' && define.amd) {

        define(['backbone', 'underscore', 'backbone.paginator'], function(Backbone, _, PageableCollection) {

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
    
    /**
     * Backbone model which represents a HAL Link.
     *
     * > A Link Object represents a hyperlink from the containing resource to a URI.
     *
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5
     */
    Hal.Link = Backbone.Model.extend(
        {
            /**
             * Boolean used to contain the 'templated' property really provided.
             *
             * @var {Boolean}
             */
            _templated : undefined,
    
            // TODO: Il serait bien que le 'href' soit un objet avec des fonction utilitaires très pratiques, par
            //       exemple pour récupérer le dernier fragment d'URL et le convertir en int automatiquement, etc...
            // TODO: Il serait top d'avoir une fonction pour construire un model du bon type avec fonction du lien, peut
            //       être que cette contruction serait basée sur une configuration 'hal._links.myLink' dans l'objet
    
            /**
             * Function used to create a new Hal.Model object using the link. The created model has only one attribute
             * which is the identifier.
             *
             * @return {Hal.Model} The new created Hal Model.
             */
            createModel : function() {
    
                return new Hal.Model({id : parseInt(this.get('href').split('/').pop(), 10)});
    
            },
    
            /**
             * Function used to build / initilize / construct a HAL link.
             *
             * @param {Object} options Options used to initilize the HAL link.
             * @param {URI | URITemplate} options.href The `href` property, the `href` property is REQUIRED.
             *        Its value is either a URI [RFC3986](https://tools.ietf.org/html/rfc3986 "RFC3986") or a URI
             *        Template [RFC6570](https://tools.ietf.org/html/rfc6570 "RFC6570").
             *
             *        If the value is a URI Template then the Link Object SHOULD have a `templated` attribute whose
             *        value is true.
             */
            initialize : function(options) {
    
                // The "href" property is mandatory
                if(!_.isObject(options) || !_.isString(options.href)) {
    
                    throw new Error('Missing required property "href" !');
    
                }
    
                // The "templated" property can only be false or true
                this._templated = this.get('templated');
                this.attributes.templated = this._templated === true;
    
                this.on('change:templated', function(model, value, options) {
    
                    this._templated = value;
    
                }, this);
    
            },
    
            /**
             * Gets the `deprecation` property, the `deprecation` property is OPTIONAL.
             *
             * Its presence indicates that the link is to be deprecated (i.e. removed) at a future date.  Its value is a
             * URL that SHOULD provide further information about the deprecation.
             *
             * A client SHOULD provide some notification (for example, by logging a warning message) whenever it
             * traverses over a link that has this property.  The notification SHOULD include the deprecation property's
             * value so that a client manitainer can easily find information about the deprecation.
             *
             * @return {URL} The value of the `deprecation` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.4
             */
            getDeprecation : function() {
    
                return this.get('deprecation');
    
            },
    
            /**
             * Gets the `name` property, the `name` property is OPTIONNAL.
             *
             * Its value MAY be used as a secondary key for selecting Link Objects which share the same relation type.
             *
             * @return {String} The value of the `name` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.5
             */
            getName : function() {
    
                return this.get('name');
    
            },
    
            /**
             * Gets the `href` property, the `href` property is REQUIRED.
             *
             * Its value is either a URI [RFC3986](https://tools.ietf.org/html/rfc3986 "RFC3986") or a URI Template
             * [RFC6570](https://tools.ietf.org/html/rfc6570 "RFC6570").
             *
             * If the value is a URI Template then the Link Object SHOULD have a `templated` attribute whose value is
             * true.
             *
             * @return {URI | URITemplate} The value of the `href` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.1
             */
            getHref : function() {
    
                return this.get('href');
    
            },
    
            /**
             * Gets the `hreflang` property, the `hreflang` property is OPTIONAL.
             *
             * Its value is a string and is intended for indicating the language of the target resource (as defined by
             * [RFC5988](https://tools.ietf.org/html/rfc5988 "RFC5988")).
             *
             * @return {String} The value of the `hreflang` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.8
             */
            getHreflang : function() {
    
                return this.get('hreflang');
    
            },
    
            /**
             * Gets the `profile` property, the `profile` property is OPTIONAL.
             *
             * Its value is a string which is a URI that hints about the profile (as defined by [I-D.wilde-profile-link]
             * (https://tools.ietf.org/html/draft-kelly-json-hal-06#ref-I-D.wilde-profile-link "I-D.wilde-profile-link"
             * )) of the target resource.
             *
             * @return {URI} The value of the `profile` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.6
             */
            getProfile : function() {
    
                return this.get('profile');
    
            },
    
            /**
             * Gets the `title` property, the `title` property is OPTIONAL.
             *
             * Its value is a string and is intended for labelling the link with a human-readable identifier (as defined
             * by [RFC5988](https://tools.ietf.org/html/rfc5988 "RFC5988")).
             *
             * @return {String} The value of the `title` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.7
             */
            getTitle : function() {
    
                return this.get('title');
    
            },
    
            /**
             * Gets the `type` property, the `type` property is OPTIONAL.
             *
             * Its value is a string used as a hint to indicate the media type expected when dereferencing the target
             * resource.
             *
             * @return {String} The value of the `type` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.3
             */
            getType : function() {
    
                return this.get('type');
    
            },
    
            /**
             * Utility function used to indicate if this link is an HAL Link Array.
             *
             * @return {Boolean} Always false here because this link a simple link.
             */
            isArray : function() {
    
                return false;
    
            },
    
            /**
             * Gets the `templated` property, the `templated` property is OPTIONAL.
             *
             * Its value is boolean and SHOULD be true when the Link Object's "href" property is a URI Template.
             *
             * Its value SHOULD be considered false if it is undefined or any other value than true.
             *
             * @return {Boolean} The value of the `templated` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.2
             */
            isTemplated : function() {
    
                return this.get('templated');
    
            },
    
            /**
             * Sets the `deprecation` property, the `deprecation` property is OPTIONAL.
             *
             * Its presence indicates that the link is to be deprecated (i.e. removed) at a future date.  Its value is a
             * URL that SHOULD provide further information about the deprecation.
             *
             * A client SHOULD provide some notification (for example, by logging a warning message) whenever it
             * traverses over a link that has this property.  The notification SHOULD include the deprecation property's
             * value so that a client manitainer can easily find information about the deprecation.
             *
             * @param {URL} deprecation The value of the `deprecation` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.4
             */
            setDeprecation : function(deprecation) {
    
                this.set('deprecation', deprecation);
    
            },
    
            /**
             * Sets the `href` property, the `href` property is REQUIRED.
             *
             * Its value is either a URI [RFC3986](https://tools.ietf.org/html/rfc3986 "RFC3986") or a URI Template
             * [RFC6570](https://tools.ietf.org/html/rfc6570 "RFC6570").
             *
             * If the value is a URI Template then the Link Object SHOULD have a `templated` attribute whose value is
             * true.
             *
             * @param {URI | URITemplate} href The value of the `href` property to set.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.1
             */
            setHref : function(href) {
    
                this.set('href', href);
    
            },
    
            /**
             * Sets the `hreflang` property, the `hreflang` property is OPTIONAL.
             *
             * Its value is a string and is intended for indicating the language of the target resource (as defined by
             * [RFC5988](https://tools.ietf.org/html/rfc5988 "RFC5988")).
             *
             * @param {String} hreflang The value of the `hreflang` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.8
             */
            setHreflang : function(hreflang) {
    
                this.set('hreflang', hreflang);
    
            },
    
            /**
             * Gets the `name` property, the `name` property is OPTIONNAL.
             *
             * Its value MAY be used as a secondary key for selecting Link Objects which share the same relation type.
             *
             * @param {String} name The value of the `name` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.5
             */
            setName : function(name) {
    
                this.set('name', name);
    
            },
    
            /**
             * Sets the `profile` property, the `profile` property is OPTIONAL.
             *
             * Its value is a string which is a URI that hints about the profile (as defined by [I-D.wilde-profile-link]
             * (https://tools.ietf.org/html/draft-kelly-json-hal-06#ref-I-D.wilde-profile-link "I-D.wilde-profile-link"
             * )) of the target resource.
             *
             * @param {URI} profile The value of the `profile` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.6
             */
            setProfile : function(profile) {
    
                this.set('profile', profile);
    
            },
    
            /**
             * Sets the `templated` property, the `templated` property is OPTIONAL.
             *
             * Its value is boolean and SHOULD be true when the Link Object's "href" property is a URI Template.
             *
             * Its value SHOULD be considered false if it is undefined or any other value than true.
             *
             * @param {Boolean} templated The value of the `templated` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.2
             */
            setTemplated : function(templated) {
    
                this.set('templated', templated);
    
            },
    
            /**
             * Sets the `title` property, the `title` property is OPTIONAL.
             *
             * Its value is a string and is intended for labelling the link with a human-readable identifier (as defined
             * by [RFC5988](https://tools.ietf.org/html/rfc5988 "RFC5988")).
             *
             * @param {String} title The value of the `title` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.7
             */
            setTitle : function(title) {
    
                this.set('title', title);
    
            },
    
            /**
             * Sets the `type` property, the `type` property is OPTIONAL.
             *
             * Its value is a string used as a hint to indicate the media type expected when dereferencing the target
             * resource.
             *
             * @param {String} type The value of the `type` property.
             *
             * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.3
             */
            setType : function(type) {
    
                this.set('type', type);
    
            },
    
            /**
             * Return a shallow copy of the model's attributes for JSON stringification. This can be used for
             * persistence, serialization, or for augmentation before being sent to the server. The name of this method
             * is a bit confusing, as it doesn't actually return a JSON string — but I'm afraid that it's the way that
             * the JavaScript API for JSON.stringify works.
             *
             * @param {Object} options Options used to configure the behavior of the method.
             * @param {String} options.contentType (Optional) A content type to be used to create the representation, currently
             *        the method accepts 'application/json' (the default one) or 'application/hal+json'.
             *
             * @return {Object} A Javascript object which represents a JSON representation of this link.
             */
            toJSON : function(options) {
    
                // If initially no 'templated' property was defined then we remove it from the attributes
                if(_.isUndefined(this._templated)) {
    
                    delete this.attributes.templated;
    
                }
    
                // Calls the parent Backbone toJSON method
                return Backbone.Model.prototype.toJSON.apply(this);
    
            }
    
        }
    );
    
    /**
     * Backbone collection which represents a set of HAL Links.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     */
    Hal.LinkArray = Backbone.Collection.extend(
        {
            /**
             * The class of the models this Backbone Collection stores / instanciate.
             * 
             * @var {Hal.Link}
             */
            model : Hal.Link,
            
            /**
             * Function used to initialize the Link Array.
             * 
             * @param {Object[]} models An array of links used to create the link array.
             * @param {Object} options Options used to initialize the Link Array.
             */
            initialize : function(models, options) {
                
                // A link array MUST BE created with models
                if(!_.isArray(models) || models.length === 0) {
                    
                    throw new Error('A LinkArray MUST BE created with at least one link model !');
                    
                }
                
                // Calls the parent Backbone initialize method
                return Backbone.Collection.prototype.initialize.apply(this, models, options);
    
            },
            
            /**
             * Utility function used to indicate if this link is an HAL Link Array.
             * 
             * @return {Boolean} Always true here because this link a Link Array.
             */
            isArray : function() {
    
                return true;
    
            }
        }
    );
    /**
     * Backbone model which represents a set of HAL Link.
     *
     * > A Link Object represents a hyperlink from the containing resource to a URI.
     *
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5
     */
    Hal.Links = Backbone.Model.extend(
        {
            /**
             * Utility function used to get the `self` link.
             *
             * @return {Hal.Link} The self link.
             */
            getSelf : function() {
    
                return this.get('self');
    
            },
    
            /**
             * Function used to indicate if the `self` link is defined.
             *
             * @return {Boolean} True if the self link is defined, false otherwise.
             */
            hasSelf : function() {
    
                var self = this.getSelf();
    
                return !(_.isNull(self) || _.isUndefined(self));
    
            },
    
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
                    function(link, rel) {
    
                        // If the provided element is already a Hal.Link we set it directly
                        if(link instanceof Hal.Link) {
    
                            Backbone.Model.prototype.set.call(this, rel, link, options);
    
                        }
    
                        // Otherwise if the provided element is an array
                        else if(_.isArray(link)) {
    
                            Backbone.Model.prototype.set.call(this, rel, new Hal.LinkArray(link), options);
    
                        }
    
                        // Otherwise if the provided element is an object
                        else if(_.isObject(link)) {
    
                            Backbone.Model.prototype.set.call(this, rel, new Hal.Link(link), options);
    
                        }
    
                        // Null or undefined are authorized
                        else if(_.isNull(link) || _.isUndefined(link)) {
    
                            Backbone.Model.prototype.set.call(this, rel, link, options);
    
                        }
                        
                        // Otherwise this is an error
                        else {
    
                            throw new Error('Invalid link identified by \'rel\'=\'' + rel + '\' !');
    
                        }
    
                    },
                    this
                );
    
                return this;
    
            },
    
            /**
             * Function used to convert this `_links` into a Javascript object to be passed to `JSON.stringify(obj)`.
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
                    
                    // Null or undefined are authorized
                    if(_.isNull(resource) || _.isUndefined(resource)) {
                    
                        json[rel] = resource;
                            
                    } 
                    
                    // Otherwise we expect a Hal.Model
                    else {
                        
                        json[rel] = resource.toJSON(_options);
                        
                    }
                    
                }
    
                return json;
    
            }
        }
    );
    
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
         * Returns a new instance of the model with identical attributes.
         *
         * @return {Hal.Model}
         */
        clone : function() {
    
            return new this.constructor(
                this.toJSON(
                    {
                        contentType : 'application/hal+json'
                    }
                )
            );
    
        },
    
        /**
         * Utility function used to check if this HAL model is linked to an `embedded` resource specified with a relation
         * type.
         *
         * @param {String} rel (Optional) The name of a relation type used to check for the existence of an embedded
         *        resource.
         *
         * @return {Boolean} True if this HAL model is linked to an `_embedded` resource specified with the `rel` relation
         *         type, false otherwise.
         */
        hasEmbedded : function(rel) {
    
            return this._embedded.has(rel);
    
        },
    
        /**
         * Utility function used to check if this HAL model is linked to a specific `link` identified by a specified
         * relation type.
         *
         * @param {String} rel (Optional) The name of a relation type used to check for the existence of a link.
         *
         * @return {Boolean} True if this HAL model is linked to link specified with the `rel` relation type, false
         *         otherwise.
         */
        hasLink : function(rel) {
    
            return this._links.has(rel);
    
        },
    
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
         * Utility function used to set a specific `_embedded` resource.
         *
         * @param {String} rel (Optional) The name of the relation type to be used to set the embedded resource.
         * @param {Hal.Model | Hal.Collection | Hal.Model[]} halResource The HAL resource to set.
         */
        setEmbedded : function(rel, halResource) {
    
            this.getEmbedded().set(rel, halResource);
    
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
         * Remove an HAL link by deleting it from the internal attributes hash. Fires a "change" event unless silent is
         * passed as an option.
         *
         * @param {String} rel The name of the relation type used to identify the HAL link to unset.
         * @param {Object} options Options used to configure the unset operation.
         */
        unsetLink : function(rel, options) {
    
            this.getLinks().unset(rel, options);
    
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
            this._links = this._links || new Hal.Links();
    
            // This check is here for the same reasons as the previous condition
            this._embedded = this._embedded || new Hal.Embedded();
    
        },
    
        /**
         * Function used to convert this model into a Javascript object to be passed to `JSON.stringify(obj)`.
         *
         * @param {Object} options Options used to configure the behavior of the function.
         * @param {String} options.contentType (Optional) A content type to be used to create the representation, currently
         *        the method accepts 'application/json' (the default one) or 'application/hal+json'.
         *
         * @return {Object} The resulting object which MUST BE compliant with HAL.
         */
        toJSON : function(options) {
    
            var noLinks = _.isEmpty(this.getLinks().attributes),
                noEmbedded = _.isEmpty(this.getEmbedded().attributes),
                cloned = null,
                _options = options || {},
                contentType = _options.contentType || Hal.contentType || 'application/json';
    
            // If the 'Content-Type' must be 'application/json'
            if(contentType === 'application/json') {
    
                cloned = _.extend({}, this.attributes, this.getEmbedded().toJSON(_options));
    
            }
    
            // If the 'Content-Type' must be 'application/hal+json'
            else if(contentType === 'application/hal+json') {
    
                // The Hal.Model has no '_links' and not '_embedded' so we do not inject them in the JSON object
                if(noLinks && noEmbedded) {
    
                    cloned = _.clone(this.attributes);
    
                }
    
                // The Hal.Model has no '_links' and has at least one '_embedded' property
                else if(noLinks) {
    
                    cloned = _.extend({}, this.attributes, {'_embedded' : this.getEmbedded().toJSON(_options)});
    
                }
    
                // The Hal.Model has at least one link and no embedded resources
                else if(noEmbedded) {
    
                    cloned = _.extend({}, this.attributes, {'_links' : this.getLinks().toJSON(_options)});
    
                }
    
                // The Hal.Model has both links and embedded resources
                else {
    
                    cloned = _.extend(
                        _.clone(this.attributes),
                        {
                            '_embedded' : this.getEmbedded().toJSON(_options),
                            '_links' : this.getLinks().toJSON(_options)
                        }
                    );
    
                }
    
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
    
            // If HAL links are declared
            if(attrs._links) {
    
                // This is the first time we set links on this HAL Model
                if(!this._links) {
    
                    this._links = new Hal.Links(attrs._links);
    
                }
    
                // This is not the first time we set links on this HAL Model (i.e this is an upgrade)
                else {
    
                    this._links.set(attrs._links);
    
                }
    
            }
    
            // If HAL embedded resources are declared
            if(attrs._embedded) {
    
                // This is the first time we set an embedded resource on this HAL Model
                if(!this._embedded) {
    
                    this._embedded = new Hal.Embedded(attrs._embedded);
    
                }
    
                // This is not the first time we set an embedded resource on this HAL Model (i.e this is an update)
                else {
    
                    this._embedded.set(attrs._embedded);
    
                }
    
            }
    
            attrs = _.omit(attrs, '_links', '_embedded');
    
            return Backbone.Model.prototype.set.call(this, attrs, options, void 0);
    
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
    
                        base = base.replace(/([^\/])$/, '$1/') + urlMiddle;
    
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
    
    (function() {
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // PRIVATE MEMBERS
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
        function finiteInt (val, name) {
            if (!_.isNumber(val) || _.isNaN(val) || !_.isFinite(val) || ~~val !== val) {
              throw new TypeError("`" + name + "` must be a finite integer");
            }
            return val;
          }
    
        /**
         * Specialized Hal Collection.
         * 
         * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
         * @author Simon BAUDRY (simon.baudry@gomoob.com)
         */
        Hal.Collection = Backbone.PageableCollection.extend(
            {
                // This is required to have access to a 'fullCollection' and to navigate inside the collection using the 
                // 'prev', 'next' and 'last' links.
                mode: 'infinite',
                
                model : Hal.Model,
                
                queryParams : {
                    currentPage : 'page',
                    pageSize : 'page_size',
                    totalPages : null,
                    totalRecords : null
                },
                state : {
                    firstPage : 1,
                    pageSize : 12
                },
                
                parseLinks: function (resp, xhr) {
                    
                    // The 'infinite' mode requires a 'first' link in the payload of the received HAL Collection
                    if(!resp._links.first && this.mode === 'infinite' && resp.total_items !== 0) {
                        
                        throw new Error(
                            'You are using the \'infinite\' mode and the server did not returned a \'first\' ' + 
                            'link attached to the HAL Collection. Check if the collection URL is correct and the payload ' + 
                            'is well formed. If your collection is not paginated you could use the \'server\' mode instead.'
                        );
    
                    }
                    
                    // The 'infinite' mode requires a 'first' link in the payload of the received HAL Collection
                    if(!resp._links.last && this.mode === 'infinite' && resp.total_items !== 0) {
                        
                        throw new Error(
                            'You are using the \'infinite\' mode and the server did not returned a \'last\' ' + 
                            'link attached to the HAL Collection. Check if the collection URL is correct and the payload ' + 
                            'is well formed. If your collection is not paginated you could use the \'server\' mode instead.'
                        );
    
                    }
    
                    var links = {};
                    
                    if(resp.total_items !== 0) {
                        links.first = resp._links.first.href;
                        links.last = resp._links.last.href;
                    }
                    
                    if(resp._links.next) {
                        links.next = resp._links.next.href;
                    }
                    
                    if(resp._links.prev) {
                        links.prev = resp._links.prev.href;
                    }
                    
                    return links;
    
                },
                
                parseRecords : function(resp, options) {
    
                    // The 'rel' parameter is required !
                    if(!this.rel) {
    
                        throw new Error('A \'rel\' parameter is required !');
    
                    }
    
                    return resp._embedded[this.rel];
                        
                },
    
                parseState: function (resp, queryParams, state, options) {
                    
                    return {
                        totalItems: resp.total_items
                    };
                    
                },
                
                // FIXME: Cette fonction a presque le même code que PageableCollection.getPage(index, options) excepté 
                //        qu'elle appelle la fonction de callback 'options.success()' si l'on est en mode 'infinite' et que 
                //        la page demandée a déjà été récupérée. Sans ce fixe les fonctions 'getPreviousPage()' et 
                //        'getNextPage()' n'appellent leurs méthodes de callbacks 'success()' ou 'error()' que si les 
                //        données associées aux pages n'ont pas déjà été récupérées !!! 
                // TODO: Poster un cas sur le Github du projet et faire un Pull Request
                getPage: function (index, options) {
    
                    var mode = this.mode, fullCollection = this.fullCollection;
    
                    options = options || {fetch: false};
    
                    var state = this.state,
                    firstPage = state.firstPage,
                    currentPage = state.currentPage,
                    lastPage = state.lastPage,
                    pageSize = state.pageSize;
    
                    var pageNum = index;
                    switch (index) {
                      case "first": pageNum = firstPage; break;
                      case "prev": pageNum = currentPage - 1; break;
                      case "next": pageNum = currentPage + 1; break;
                      case "last": pageNum = lastPage; break;
                      default: pageNum = finiteInt(index, "index");
                    }
    
                    this.state = this._checkState(_.extend({}, state, {currentPage: pageNum}));
    
                    options.from = currentPage; 
                    options.to = pageNum;
    
                    var pageStart = (firstPage === 0 ? pageNum : pageNum - 1) * pageSize;
                    var pageModels = fullCollection && fullCollection.length ?
                      fullCollection.models.slice(pageStart, pageStart + pageSize) :
                      [];
                    if ((mode == "client" || (mode == "infinite" && !_.isEmpty(pageModels))) &&
                        !options.fetch) {
                      
                        this.reset(pageModels, _.omit(options, "fetch"));
                      
                        // >>>> Bout de code ajouté
                        // FIXME: On a pas la réponse ici ???
                        options.success(pageModels, null /* response */, options);
                        // <<<<
                        
                      return this;
                    }
    
                    if (mode == "infinite") options.url = this.links[pageNum];
    
                    return this.fetch(_.omit(options, "fetch"));
                  }
    
            }
        );
        
    })();

    return Hal;

}));

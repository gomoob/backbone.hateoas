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
         * @return {Object} A Javascript object which represents a JSON representation of this link.
         */
        toJSON : function() {

            // If initially no 'templated' property was defined then we remove it from the attributes
            if(_.isUndefined(this._templated)) {

                delete this.attributes.templated;

            }

            // Calls the parent Backbone toJSON method
            return Backbone.Model.prototype.toJSON.apply(this);
            
        }
        
    }
);

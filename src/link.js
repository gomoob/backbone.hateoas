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
         *        Its value is either a URI [RFC3986](https://tools.ietf.org/html/rfc3986 "RFC3986") or a URI Template 
         *        [RFC6570](https://tools.ietf.org/html/rfc6570 "RFC6570").
         *        
         *        If the value is a URI Template then the Link Object SHOULD have a `templated` attribute whose value is 
         *        true.
         */
        initialize : function(options) {
        
            // The "href" property is mandatory
            if(_.isNull(options) || _.isUndefined(options) || _.isNull(options.href) || _.isUndefined(options.href)) {
                
                throw new Error('Missing required property "href" !');

            }

        },

        getDeprecation : function() {
          
            return this.get('deprecation');
            
        },
        
        getName : function() {
          
            return this.get('name');
            
        },
        
        isTemplated : function() {
        
            return this.get('templated');
            
        },
        
        /**
         * Gets the `href` property, the `href` property is REQUIRED.
         * 
         * Its value is either a URI [RFC3986](https://tools.ietf.org/html/rfc3986 "RFC3986") or a URI Template 
         * [RFC6570](https://tools.ietf.org/html/rfc6570 "RFC6570").
         * 
         * If the value is a URI Template then the Link Object SHOULD have a `templated` attribute whose value is true.
         * 
         * @return {URI | URITemplate} The value of the `href` property.
         * 
         * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.1
         */
        getHref : function() {

            return this.get('href');

        },
        
        getHreflang : function() {
          
            return this.get('hreflang');
            
        },
        
        getProfile : function() {
          
            return this.get('profile');
            
        },
        
        getTitle : function() {
          
            return this.get('title');
            
        },
        
        getType : function() {
          
            return this.get('type');
            
        },
        
        setDeprecation : function(deprecation) {
          
            this.set('deprecation', deprecation);
            
        },
        
        /**
         * Sets the `href` property, the `href` property is REQUIRED.
         * 
         * Its value is either a URI [RFC3986](https://tools.ietf.org/html/rfc3986 "RFC3986") or a URI Template 
         * [RFC6570](https://tools.ietf.org/html/rfc6570 "RFC6570").
         * 
         * If the value is a URI Template then the Link Object SHOULD have a `templated` attribute whose value is true.
         * 
         * @param {URI | URITemplate} href The value of the `href` property to set.
         * 
         * @see https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5.1
         */
        setHref : function(href) {

            this.set('href', href);

        },
        
        setHreflang : function(hreflang) {
          
            this.set('hreflang', hreflang);
            
        },
        
        setName : function(name) {
          
            this.set('name', name);
            
        },
        
        setProfile : function(profile) {
          
            this.set('profile', profile);
            
        },
        
        setTemplated : function(templated) {
            
            this.set('templated', templated);
            
        },
        
        setTitle : function(title) {
          
            this.set('title', title);
            
        },
        
        setType : function(type) {
            
            this.set('type', type);
            
        }
        
    }
);
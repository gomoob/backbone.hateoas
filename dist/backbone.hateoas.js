(function(root, factory) {
    
    if (typeof define === 'function' && define.amd) {
        
        define(['backbone', 'underscore', 'backbone.paginator'], function(Backbone, Underscore, PageableCollection) {

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
    
                // The "templated" property can only be false or true
                this.set('templated', this.get('templated') === true);
    
            },
    
            /**
             * Gets the `deprecation` property, the `deprecation` property is OPTIONAL.
             * 
             * Its presence indicates that the link is to be deprecated (i.e. removed) at a future date.  Its value is a URL 
             * that SHOULD provide further information about the deprecation.
             * 
             * A client SHOULD provide some notification (for example, by logging a warning message) whenever it traverses 
             * over a link that has this property.  The notification SHOULD include the deprecation property's value so that 
             * a client manitainer can easily find information about the deprecation.
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
             * If the value is a URI Template then the Link Object SHOULD have a `templated` attribute whose value is true.
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
             * Its value is a string which is a URI that hints about the profile (as defined by [I-D.wilde-profile-link](
             * https://tools.ietf.org/html/draft-kelly-json-hal-06#ref-I-D.wilde-profile-link "I-D.wilde-profile-link")) of 
             * the target resource.
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
             * Its value is a string and is intended for labelling the link with a human-readable identifier (as defined by 
             * [RFC5988](https://tools.ietf.org/html/rfc5988 "RFC5988")).
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
             * Its presence indicates that the link is to be deprecated (i.e. removed) at a future date.  Its value is a URL 
             * that SHOULD provide further information about the deprecation.
             * 
             * A client SHOULD provide some notification (for example, by logging a warning message) whenever it traverses 
             * over a link that has this property.  The notification SHOULD include the deprecation property's value so that 
             * a client manitainer can easily find information about the deprecation.
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
             * If the value is a URI Template then the Link Object SHOULD have a `templated` attribute whose value is true.
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
             * Its value is a string which is a URI that hints about the profile (as defined by [I-D.wilde-profile-link](
             * https://tools.ietf.org/html/draft-kelly-json-hal-06#ref-I-D.wilde-profile-link "I-D.wilde-profile-link")) of 
             * the target resource.
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
             * Its value is a string and is intended for labelling the link with a human-readable identifier (as defined by 
             * [RFC5988](https://tools.ietf.org/html/rfc5988 "RFC5988")).
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
    
        getEmbedded : function(rel) {
    
            return this.get('_embedded').get(rel);
    
        },
    
        getLink : function(rel) {
    
            return this.get('_links').get(rel);
    
        }, 
        
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
            parsed._links = new Hal.Model();
            _.map(
                resp._links, 
                function(link, linkName) {
                    
                    parsed._links.set(linkName, new Hal.Link(link));
    
                },
                this
            );
            
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
    
    /**
     * Specialized Hal Collection.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @author Simon BAUDRY (simon.baudry@gomoob.com)
     */
    // TODO: Ceci pourrait peut-être enfin service à créer une Backbone.HalCollection puissant et fonctionnelle ? ...
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
    
                // The 'halCollectionName' parameter is required !
                if(!this.halCollectionName) {
    
                    throw new Error('A \'halCollectionName\' parameter is required !');
    
                }
    
                return resp._embedded[this.halCollectionName];
                    
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

    return Hal;

}));

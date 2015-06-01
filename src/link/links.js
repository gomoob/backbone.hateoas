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
         * Function used to initialize the links.
         * 
         * @param {Object} options Options used to initialize the links.
         */
        initialize : function(options) {

            _.map(
                options, 
                function(link, rel) {

                    this.set(rel, _.isArray(link) ? new Hal.LinkArray(link) : new Hal.Link(link));

                },
                this
            );

        }, 
        
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

        }
    }
);

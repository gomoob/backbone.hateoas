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

                Hal.ErrorHandler.capture(
                    'A LinkArray MUST BE created with at least one link model !',
                    'Hal.LinkArray.initialize',
                    {
                        models : models,
                        options : options
                    }
                );

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
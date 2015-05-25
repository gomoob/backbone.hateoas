/**
 * Backbone model which represents an HAL Link.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
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

        }
        
    }
);
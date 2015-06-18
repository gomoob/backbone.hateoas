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
     * Specialized Hal Collection. User should set `rel` property.
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
            /**
               @property {string} name of relation in the collection. Usually it's the only key in _embedded collection
            */
            rel: null,
            /**
               @property {string} name if 'page' entity for current paging position
            */
            pageProperty: null,
            
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
                
                var page = this._getPageEntity(resp);
                if(page[queryParams.totalRecords] !== 0) {
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

            _getPageEntity: function(resp) {
                if (this.pageProperty && _.has(resp, this.pageProperty)) {
                    return resp[this.pageProperty];
                } else {
                    return resp;
                }
            },

            parseState: function (resp, queryParams, state, options) {
                var page = this._getPageEntity(resp);

                var newState = {
                    currentPage: page[queryParams.currentPage],
                    pageSize: page[queryParams.pageSize]
                };

                if (queryParams.totalRecords && _.has(page, queryParams.totalRecords)) {
                    newState.totalRecords = page[queryParams.totalRecords];
                }
                if (queryParams.totalPages && _.has(page, queryParams.totalPages)) {
                    newState.totalPages = page[queryParams.totalPages];
                }

                return newState;
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
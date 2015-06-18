/*jshint -W030 */

describe(
    'Hal.Collection',
    function() {

        describe('initialize', function() {

            it('With no parameters should succeed', function() {

                var collection = new Hal.Collection();

            });

        });

        describe('parse', function() {
            it('With server mode', function() {
                var CustomCollection = Hal.Collection.extend({
                    parseParams: {
                        currentPage: 'page',
                        pageSize: 'page_size',
                        totalPages: 'totalPages',
                        totalRecords: 'totalElements'
                    },
                    mode: 'server'
                });
                var collection = new CustomCollection();
                collection.rel = 'users';
                collection.parse({
                    '_links': {
                        'self': {
                            'href': 'http://localhost:8080/rest/users{?page,size,sort}',
                            'templated': true
                        },
                        'search': {
                            'href': 'http://localhost:8080/rest/users/search'
                        }
                    },
                    '_embedded': {
                        'users': [{
                            'firstName': 'Baptiste',
                            'lastName': 'Gaillard'
                        }, {
                            'firstName': 'Simon',
                            'lastName': 'Baudry'
                        }, {
                            'firstName': 'John',
                            'lastName': 'Doe',
                        }]
                    },
                    'page_size': 20,
                    'totalElements': 3,
                    'totalPages': 1,
                    'page': 1
                });

                // assert
                expect(collection.state.currentPage).to.equal(1);
                expect(collection.state.totalRecords).to.equal(3);
                expect(collection.state.pageSize).to.equal(20);
                expect(collection.hasNextPage()).to.equal(false);
                expect(collection.hasPreviousPage()).to.equal(false);
            });

            it('With server mode and custom paging', function() {
                var CustomCollection = Hal.Collection.extend({
                    parseParams: {
                        currentPage: 'number',
                        pageSize: 'size',
                        totalPages: 'totalPages',
                        totalRecords: 'totalElements'
                    },
                    state: {
                        firstPage: 0
                    },
                    pageProperty: 'page',
                    mode: 'server'
                });
                var collection = new CustomCollection();
                collection.rel = 'users';
                collection.parse({
                    '_links': {
                        'self': {
                            'href': 'http://localhost:8080/rest/users{?page,size,sort}',
                            'templated': true
                        },
                        'search': {
                            'href': 'http://localhost:8080/rest/users/search'
                        }
                    },
                    '_embedded': {
                        'users': [{
                            'firstName': 'Baptiste',
                            'lastName': 'Gaillard'
                        }, {
                            'firstName': 'Simon',
                            'lastName': 'Baudry'
                        }, {
                            'firstName': 'John',
                            'lastName': 'Doe',
                        }]
                    },
                    'page': {
                        'size': 20,
                        'totalElements': 3,
                        'totalPages': 1,
                        'number': 0
                    }
                });

                // assert
                expect(collection.state.currentPage).to.equal(0);
                expect(collection.state.totalRecords).to.equal(3);
                expect(collection.state.pageSize).to.equal(20);
                expect(collection.hasNextPage()).to.equal(false);
                expect(collection.hasPreviousPage()).to.equal(false);
            });

            it('With server mode and custom paging and several pages', function() {
                var CustomCollection = Hal.Collection.extend({
                    parseParams: {
                        currentPage: 'number',
                        pageSize: 'size',
                        totalPages: 'totalPages',
                        totalRecords: 'totalElements'
                    },
                    state: {
                        firstPage: 0
                    },
                    pageProperty: 'page',
                    mode: 'server'
                });
                var collection = new CustomCollection();
                collection.rel = 'users';
                collection.parse({
                    '_links': {
                        'self': {
                            'href': 'http://localhost:8080/rest/users{?page,size,sort}',
                            'templated': true
                        },
                        'search': {
                            'href': 'http://localhost:8080/rest/users/search'
                        }
                    },
                    '_embedded': {
                        'users': [{
                            'firstName': 'Baptiste',
                            'lastName': 'Gaillard'
                        }]
                    },
                    'page': {
                        'size': 1,
                        'totalElements': 3,
                        'totalPages': 3,
                        'number': 0
                    }
                });

                // assert
                expect(collection.state.currentPage).to.equal(0);
                expect(collection.state.totalRecords).to.equal(3);
                expect(collection.state.pageSize).to.equal(1);
                expect(collection.hasNextPage()).to.equal(true);
                expect(collection.hasPreviousPage()).to.equal(false);
            });

        });

    }
);
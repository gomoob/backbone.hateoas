/*jshint -W030 */

describe(
    'Hal.Embedded',
    function() {

        describe('initialize', function() {

            it('With no models do nothing', function() {

                var embedded = new Hal.Embedded();
                expect(embedded.attributes).to.be.defined;
                expect(embedded.attributes).to.be.empty;

            });

            it('With embedded resources but without \'embedded\' configuration', function() {

                var embedded = new Hal.Embedded({
                    user : {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard',
                        _links : {
                            self: {
                                href : 'http://myserver.com/api/users/1'
                            }
                        }
                    },
                    addresses : [
                        {
                            city : 'Paris',
                            country : 'France',
                            street : '142 Rue de Rivoli',
                            zip : '75001',
                            _links : {
                                self : {
                                    href : 'http://myserver.com/api/addresses/1'
                                }
                            }
                        },
                        {
                            city : 'Nantes',
                            country : 'France',
                            street : '11 Bis Rue de Maréchal de Lattre de Tassigny',
                            zip : '44000',
                            _links : {
                                self : {
                                    href : 'http://myserver.com/api/addresses/2'
                                }
                            }
                        }
                    ]
                });

                expect(embedded.attributes).to.be.defined;
                expect(embedded.attributes).to.have.property('user');
                expect(embedded.attributes).to.have.property('addresses');

                // Checks the 'user' embedded resource
                var user = embedded.get('user');
                expect(user).to.be.an.instanceof(Hal.Model);

                expect(JSON.stringify(user.toJSON())).to.equal(JSON.stringify({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard'
                }));

                // Checks the 'addresses' embedded resource
                var addresses = embedded.get('addresses');
                expect(addresses).to.be.an.array;
                expect(addresses).to.have.length(2);
                expect(JSON.stringify(addresses[0].toJSON())).to.equal(JSON.stringify(
                    {
                        city : 'Paris',
                        country : 'France',
                        street : '142 Rue de Rivoli',
                        zip : '75001'
                    }
                ));
                expect(JSON.stringify(addresses[1].toJSON())).to.equal(JSON.stringify({
                        city : 'Nantes',
                        country : 'France',
                        street : '11 Bis Rue de Maréchal de Lattre de Tassigny',
                        zip : '44000'
                    }
                ));

            });

            it('With undefined and null embedded resources', function() {

                var embedded = new Hal.Embedded({
                    user : {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard',
                        _links : {
                            self: {
                                href : 'http://myserver.com/api/users/1'
                            }
                        }
                    },
                    undefinedEmbeddedRessource : undefined,
                    nullEmbeddedRessource : null
                });

                // Checks the 'user' embedded resource
                var user = embedded.get('user');
                expect(user).to.be.an.instanceof(Hal.Model);

                expect(JSON.stringify(user.toJSON())).to.equal(JSON.stringify({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard'
                }));

                // Checks the 'undefinedEmbeddedRessource' embedded resource
                expect(embedded.attributes).to.have.property('undefinedEmbeddedRessource');
                expect(embedded.get('undefinedEmbeddedRessource')).to.be.undefined;

                // Checks the 'nullEmbeddedRessource' embedded resource
                expect(embedded.attributes).to.have.property('nullEmbeddedRessource');
                expect(embedded.get('nullEmbeddedRessource')).to.be.null;

            });

        });

        describe('set', function() {

            it('With a Backbone.Collection object', function() {

                var embedded = new Hal.Embedded(),
                    collection = new Backbone.Collection();

                collection.add({firstname: 'Baptiste', lastname : 'Gaillard'});

                embedded.set('myCollection', collection);

                expect(embedded.get('myCollection')).to.be.an.instanceof(Backbone.Collection);
                expect(embedded.get('myCollection').size()).to.be.equal(1);
                expect(embedded.get('myCollection').at(0)).to.be.an.instanceof(Backbone.Model);
                expect(embedded.get('myCollection').at(0).get('firstname')).to.be.equal('Baptiste');
                expect(embedded.get('myCollection').at(0).get('lastname')).to.be.equal('Gaillard');

            });

        });

        describe('toJSON', function() {

            it('With very simple link', function() {

                var embedded = new Hal.Embedded({
                    user : {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard',
                        _links : {
                            self: {
                                href : 'http://myserver.com/api/users/1'
                            }
                        }
                    }
                });

                expect(JSON.stringify(embedded.toJSON())).to.equal(JSON.stringify({
                    'user' : {
                        'firstName' : 'Baptiste',
                        'lastName' : 'Gaillard'
                    }
                }));

            });

            it('With contentType parameter specified', function() {

                var embedded = new Hal.Embedded({
                    user : {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard',
                        _links : {
                            self: {
                                href : 'http://myserver.com/api/users/1'
                            }
                        }
                    }
                });

                expect(JSON.stringify(embedded.toJSON({contentType : 'application/json'}))).to.equal(JSON.stringify({
                    'user' : {
                        'firstName' : 'Baptiste',
                        'lastName' : 'Gaillard'
                    }
                }));

                expect(JSON.stringify(embedded.toJSON({contentType : 'application/hal+json'}))).to.equal(JSON.stringify({
                    'user' : {
                        'firstName' : 'Baptiste',
                        'lastName' : 'Gaillard',
                        '_links' : {
                            'self' : {
                                'href' : 'http://myserver.com/api/users/1'
                            }
                        }
                    }
                }));

            });

            it('With undefined and null values', function() {

                var embedded = new Hal.Embedded({
                        user : {
                            firstName : 'Baptiste',
                            lastName : 'Gaillard',
                            _links : {
                                self: {
                                    href : 'http://myserver.com/api/users/1'
                                }
                            }
                        },
                        undefinedEmbeddedRessource : undefined,
                        nullEmbeddedRessource : null
                    }),
                    embeddedJSONified = embedded.toJSON();

                expect(JSON.stringify(embeddedJSONified)).to.equal(JSON.stringify({
                    'user' : {
                        'firstName' : 'Baptiste',
                        'lastName' : 'Gaillard'
                    },
                    'undefinedEmbeddedRessource' : undefined,
                    'nullEmbeddedRessource' : null
                }));

            });

        });

    }
);
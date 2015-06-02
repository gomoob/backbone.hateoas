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
                    lastName : 'Gaillard',
                    _links : {
                        self: {
                            href : 'http://myserver.com/api/users/1'
                        }
                    }
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
                        zip : '75001',
                        _links : {
                            self : {
                                href : 'http://myserver.com/api/addresses/1'
                            }
                        }
                    }
                ));
                expect(JSON.stringify(addresses[1].toJSON())).to.equal(JSON.stringify({
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
                ));

            });

        });

    }
);
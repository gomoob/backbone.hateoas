/*jshint -W030 */

describe(
    'Hal.Model',
    function() {

        describe('clone', function() {

            it('With an empty model', function() {

                var model = new Hal.Model(),
                clonedModel = model.clone();

                // The 2 object must not be the same
                expect(model.cid).to.not.equal(clonedModel.cid);

                // The first model does not contain any attribute
                expect(model.attributes).to.be.empty;
                expect(model.getEmbedded().attributes).to.be.empty;
                expect(model.getLinks().attributes).to.be.empty;

                // The cloned model does not contain any attribute
                expect(clonedModel.attributes).to.be.empty;
                expect(clonedModel.getEmbedded().attributes).to.be.empty;
                expect(clonedModel.getLinks().attributes).to.be.empty;

            });

            it('With simple properties and links and no _embedded', function() {

                var model = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard',
                        _links : {
                            friends : [
                                {
                                    href: 'http://myserver.com/api/users/2'
                                },
                                {
                                    href: 'http://myserver.com/api/users/3'
                                }
                            ],
                            self : {
                                href: 'http://myserver.com/api/users/1'
                            }
                        }
                    }
                ),
                clonedModel = model.clone();

                // The 2 object must not be the same
                expect(model.cid).to.not.equal(clonedModel.cid);

                // The first model does not contain any attribute
                expect(Object.keys(model.attributes)).to.have.length(2);
                expect(model.attributes.firstName).to.equal('Baptiste');
                expect(model.attributes.lastName).to.equal('Gaillard');
                expect(model.getEmbedded().attributes).to.be.empty;
                expect(Object.keys(model.getLinks().attributes)).to.have.length(2);
                expect(JSON.stringify(model.getLinks().attributes.friends.toJSON())).to.equal(JSON.stringify([
                    {
                        href: 'http://myserver.com/api/users/2'
                    },
                    {
                        href: 'http://myserver.com/api/users/3'
                    }
                ]));
                expect(JSON.stringify(model.getLinks().attributes.self.toJSON())).to.equal(JSON.stringify({
                    href: 'http://myserver.com/api/users/1'
                }));

                // The cloned model does not contain any attribute
                expect(Object.keys(clonedModel.attributes)).to.have.length(2);
                expect(clonedModel.attributes.firstName).to.equal('Baptiste');
                expect(clonedModel.attributes.lastName).to.equal('Gaillard');
                expect(clonedModel.getEmbedded().attributes).to.be.empty;
                expect(Object.keys(clonedModel.getLinks().attributes)).to.have.length(2);
                expect(JSON.stringify(clonedModel.getLinks().attributes.friends.toJSON())).to.equal(JSON.stringify([
                    {
                        href: 'http://myserver.com/api/users/2'
                    },
                    {
                        href: 'http://myserver.com/api/users/3'
                    }
                ]));
                expect(JSON.stringify(clonedModel.getLinks().attributes.self.toJSON())).to.equal(JSON.stringify({
                    href: 'http://myserver.com/api/users/1'
                }));

            });

            it('With simple properties and no links and _embedded', function() {

                var model = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard',
                        _embedded : {
                            address : {
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
                            friends : [
                                {
                                    firstName : 'Simon',
                                    lastName : 'Baudry',
                                    _links : {
                                        self : {
                                            href: 'http://myserver.com/api/users/2'
                                        }
                                    }
                                },
                                {
                                    firstName : 'John',
                                    lastName : 'Doe',
                                    _links : {
                                        self : {
                                            href: 'http://myserver.com/api/users/3'
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ),
                clonedModel = model.clone();

                // The 2 object must not be the same
                expect(model.cid).to.not.equal(clonedModel.cid);

                // Checks the first model
                expect(Object.keys(model.attributes)).to.have.length(2);
                expect(model.attributes.firstName).to.equal('Baptiste');
                expect(model.attributes.lastName).to.equal('Gaillard');
                expect(model.getLinks().attributes).to.be.empty;
                expect(Object.keys(model.getEmbedded().attributes)).to.have.length(2);
                expect(
                    JSON.stringify(model.getEmbedded('address').toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
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
                    )
                );
                expect(model.getEmbedded('friends')).to.have.length(2);
                expect(
                    JSON.stringify(model.getEmbedded('friends')[0].toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
                        {
                            firstName : 'Simon',
                            lastName : 'Baudry',
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/2'
                                }
                            }
                        }
                    )
                );
                expect(
                    JSON.stringify(model.getEmbedded('friends')[1].toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
                        {
                            firstName : 'John',
                            lastName : 'Doe',
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/3'
                                }
                            }
                        }
                    )
                );

                // Checks the cloned model
                expect(Object.keys(clonedModel.attributes)).to.have.length(2);
                expect(clonedModel.attributes.firstName).to.equal('Baptiste');
                expect(clonedModel.attributes.lastName).to.equal('Gaillard');
                expect(clonedModel.getLinks().attributes).to.be.empty;
                expect(Object.keys(clonedModel.getEmbedded().attributes)).to.have.length(2);
                expect(
                    JSON.stringify(clonedModel.getEmbedded('address').toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
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
                    )
                );
                expect(clonedModel.getEmbedded('friends')).to.have.length(2);
                expect(
                    JSON.stringify(clonedModel.getEmbedded('friends')[0].toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
                        {
                            firstName : 'Simon',
                            lastName : 'Baudry',
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/2'
                                }
                            }
                        }
                    )
                );
                expect(
                    JSON.stringify(clonedModel.getEmbedded('friends')[1].toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
                        {
                            firstName : 'John',
                            lastName : 'Doe',
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/3'
                                }
                            }
                        }
                    )
                );

            });

            it('With simple properties and links and _embedded', function() {

                var model = new Hal.Model({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _embedded : {
                        address : {
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
                        friends : [
                            {
                                firstName : 'Simon',
                                lastName : 'Baudry',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/2'
                                    }
                                }
                            },
                            {
                                firstName : 'John',
                                lastName : 'Doe',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/3'
                                    }
                                }
                            }
                        ]
                    },
                    _links : {
                        self: {
                            href : 'http://myserver.com/api/users/1'
                        }
                    }
                }),
                clonedModel = model.clone();

                // The 2 object must not be the same
                expect(model.cid).to.not.equal(clonedModel.cid);

                // Checks the first model
                expect(Object.keys(model.attributes)).to.have.length(2);
                expect(model.attributes.firstName).to.equal('Baptiste');
                expect(model.attributes.lastName).to.equal('Gaillard');
                expect(Object.keys(model.getLinks().attributes)).to.have.length(1);
                expect(JSON.stringify(model.getLinks().attributes.self.toJSON())).to.equal(JSON.stringify({
                    href : 'http://myserver.com/api/users/1'
                }));
                expect(Object.keys(model.getEmbedded().attributes)).to.have.length(2);
                expect(
                    JSON.stringify(model.getEmbedded('address').toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
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
                    )
                );
                expect(model.getEmbedded('friends')).to.have.length(2);
                expect(
                    JSON.stringify(model.getEmbedded('friends')[0].toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
                        {
                            firstName : 'Simon',
                            lastName : 'Baudry',
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/2'
                                }
                            }
                        }
                    )
                );
                expect(
                    JSON.stringify(model.getEmbedded('friends')[1].toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
                        {
                            firstName : 'John',
                            lastName : 'Doe',
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/3'
                                }
                            }
                        }
                    )
                );

                // Checks the cloned model
                expect(Object.keys(clonedModel.attributes)).to.have.length(2);
                expect(clonedModel.attributes.firstName).to.equal('Baptiste');
                expect(clonedModel.attributes.lastName).to.equal('Gaillard');
                expect(Object.keys(clonedModel.getLinks().attributes)).to.have.length(1);
                expect(JSON.stringify(clonedModel.getLinks().attributes.self.toJSON())).to.equal(JSON.stringify({
                    href : 'http://myserver.com/api/users/1'
                }));
                expect(Object.keys(clonedModel.getEmbedded().attributes)).to.have.length(2);
                expect(
                    JSON.stringify(clonedModel.getEmbedded('address').toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
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
                    )
                );
                expect(clonedModel.getEmbedded('friends')).to.have.length(2);
                expect(
                    JSON.stringify(clonedModel.getEmbedded('friends')[0].toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
                        {
                            firstName : 'Simon',
                            lastName : 'Baudry',
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/2'
                                }
                            }
                        }
                    )
                );
                expect(
                    JSON.stringify(clonedModel.getEmbedded('friends')[1].toJSON({contentType : 'application/hal+json'}))
                ).to.equal(
                    JSON.stringify(
                        {
                            firstName : 'John',
                            lastName : 'Doe',
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/3'
                                }
                            }
                        }
                    )
                );

            });

        });

        describe('hasEmbedded', function() {

            it('With an empty model', function() {

                var model = new Hal.Model();

                expect(model.hasEmbedded('rel1')).to.be.false;
                expect(model.hasEmbedded('rel2')).to.be.false;
                expect(model.hasEmbedded('rel3')).to.be.false;

            });

            it('With a not empty model', function() {

                var model = new Hal.Model({
                    firstName : 'John',
                    lastName : 'Doe',
                    _embedded : {
                        rel1 : {
                            prop1 : 'prop1_value',
                            prop2 : 'prop2_value'
                        },
                        rel2 : null,
                        rel3 : undefined
                    }
                });

                expect(model.hasEmbedded('rel1')).to.be.true;
                expect(model.hasEmbedded('rel2')).to.be.false;
                expect(model.hasEmbedded('rel3')).to.be.false;

            });

        });

        describe('hasLink', function() {

            it('With an empty model', function() {

                var model = new Hal.Model();

                expect(model.hasLink('rel1')).to.be.false;
                expect(model.hasLink('rel2')).to.be.false;
                expect(model.hasLink('rel3')).to.be.false;

            });

            it('With a not empty model', function() {

                var model = new Hal.Model({
                    firstName : 'John',
                    lastName : 'Doe',
                    _links : {
                        rel1 : {
                            href: 'http://myserver.com/api/users/1'
                        }
                        /* Set it after fixing issue 8
                         *
                         * @see https://github.com/gomoob/backbone.hateoas/issues/8
                        ,
                        rel2 : null,
                        rel3 : undefined
                        */
                    }
                });

                expect(model.hasLink('rel1')).to.be.true;
                expect(model.hasLink('rel2')).to.be.false;
                expect(model.hasLink('rel3')).to.be.false;
                expect(model.hasLink('rel4')).to.be.false;

            });

        });

        describe('initialize', function() {

            it('With no parameters should succeed', function() {

                var model = new Hal.Model();

                // Check properties
                expect(model.attributes).to.be.an('object');
                expect(model.attributes).to.be.empty;

                // Check links
                expect(model.getLinks().attributes).to.be.empty;

                // Check embedded properties
                expect(model.getEmbedded().attributes).to.be.empty;

            });

            it('With simple properties and no links or _embedded', function() {

                var model = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard'
                    }
                );

                // Check properties
                expect(model.attributes).to.be.an('object');
                expect(model.attributes).to.have.property('firstName', 'Baptiste');
                expect(model.attributes).to.have.property('lastName', 'Gaillard');
                expect(model.get('firstName')).to.equal('Baptiste');
                expect(model.get('lastName')).to.equal('Gaillard');

                // Check links
                expect(model.getLinks().attributes).to.be.empty;

                // Check embedded properties
                expect(model.getEmbedded().attributes).to.be.empty;

            });

            it('With simple properties and links and no _embedded', function() {

                var model = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard',
                        _links : {
                            friends : [
                                {
                                    href: 'http://myserver.com/api/users/2'
                                },
                                {
                                    href: 'http://myserver.com/api/users/3'
                                }
                            ],
                            self : {
                                href: 'http://myserver.com/api/users/1'
                            }
                        }
                    }
                );

                // Check properties
                expect(model.attributes).to.be.an('object');
                expect(model.attributes).to.have.property('firstName', 'Baptiste');
                expect(model.attributes).to.have.property('lastName', 'Gaillard');
                expect(model.get('firstName')).to.equal('Baptiste');
                expect(model.get('lastName')).to.equal('Gaillard');

                // Check links
                expect(model.getLinks()).to.be.defined;
                expect(model.getLinks().attributes).to.have.property('friends');
                expect(model.getLinks().attributes).to.have.property('self');
                expect(model.getLinks().get('friends')).to.be.defined;
                expect(model.getLinks().get('self')).to.be.defined;

                var friends = model.getLinks().get('friends');
                expect(friends.isArray()).to.be.true;
                expect(friends.size()).to.equal(2);
                expect(friends.at(0).get('href')).to.equal('http://myserver.com/api/users/2');
                expect(friends.at(0).getHref()).to.equal('http://myserver.com/api/users/2');
                expect(friends.at(1).get('href')).to.equal('http://myserver.com/api/users/3');
                expect(friends.at(1).getHref()).to.equal('http://myserver.com/api/users/3');

                var self = model.getLinks().get('self');
                expect(self.isArray()).to.be.false;
                expect(self.get('href')).to.equal('http://myserver.com/api/users/1');
                expect(self.getHref()).to.equal('http://myserver.com/api/users/1');

                // Check embedded properties
                expect(model.getEmbedded().attributes).to.be.empty;

            });

            it('With simple properties and no links and _embedded', function() {

                var model = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard',
                        _embedded : {
                            address : {
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
                            friends : [
                                {
                                    firstName : 'Simon',
                                    lastName : 'Baudry',
                                    _links : {
                                        self : {
                                            href: 'http://myserver.com/api/users/2'
                                        }
                                    }
                                },
                                {
                                    firstName : 'John',
                                    lastName : 'Doe',
                                    _links : {
                                        self : {
                                            href: 'http://myserver.com/api/users/3'
                                        }
                                    }
                                }
                            ],
                            hobbies : {
                                count : 3,
                                total : 12,
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/1/hobbies?page=2'
                                    },
                                    first : {
                                        href: 'http://myserver.com/api/users/1/hobbies?page=1'
                                    },
                                    prev : {
                                        href : 'http://myserver.com/api/users/1/hobbies?page=1'
                                    },
                                    next : {
                                        href : 'http://myserver.com/api/users/1/hobbies?page=3'
                                    },
                                    last : {
                                        href : 'http://myserver.com/api/users/1/hobbies?page=4'
                                    }
                                }
                            }
                        }
                    }
                );

                // Check properties
                expect(model.attributes).to.be.an('object');
                expect(model.attributes).to.have.property('firstName', 'Baptiste');
                expect(model.attributes).to.have.property('lastName', 'Gaillard');
                expect(model.get('firstName')).to.equal('Baptiste');
                expect(model.get('lastName')).to.equal('Gaillard');

                // Check links
                expect(model.getLinks()).to.be.defined;

                // Check embedded properties
                expect(model.getEmbedded()).to.be.defined;

            });

            it('With simple properties and links and _embedded', function() {

                var user = new Hal.Model({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _embedded : {
                        address : {
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
                        friends : [
                            {
                                firstName : 'Simon',
                                lastName : 'Baudry',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/2'
                                    }
                                }
                            },
                            {
                                firstName : 'John',
                                lastName : 'Doe',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/3'
                                    }
                                }
                            }
                        ],
                        hobbies : {
                            count : 3,
                            total : 12,
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=2'
                                },
                                first : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                prev : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                next : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=3'
                                },
                                last : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=4'
                                }
                            }
                        }
                    },
                    _links : {
                        self: {
                            href : 'http://myserver.com/api/users/1'
                        }
                    }
                });

                // Check properties
                expect(user.attributes).to.be.an('object');
                expect(user.attributes).to.have.property('firstName', 'Baptiste');
                expect(user.attributes).to.have.property('lastName', 'Gaillard');
                expect(user.get('firstName')).to.equal('Baptiste');
                expect(user.get('lastName')).to.equal('Gaillard');

                // Check links
                expect(user.getLinks()).to.be.defined;
                expect(user.getLink('self').get('href')).to.equal('http://myserver.com/api/users/1');

                // Check embedded properties
                expect(user.getEmbedded()).to.be.defined;

            });

        });

        describe('toJSON using "application/hal+json" content type', function() {

            it('With a simple object without links and without embedded resources', function() {

                // Configures backbone.hateoas to always serialze using HAL
                Hal.contentType = 'application/hal+json';

                var user = new Hal.Model({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard'
                });

                expect(JSON.stringify(user.toJSON())).to.equal(JSON.stringify({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard'
                }));

            });

            it('With a simple object with links and without embedded resources', function() {

                // Configures backbone.hateoas to always serialze using HAL
                Hal.contentType = 'application/hal+json';

                var user = new Hal.Model({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _links : {
                        self: {
                            href : 'http://myserver.com/api/users/1'
                        }
                    }
                });

                expect(JSON.stringify(user.toJSON())).to.equal(JSON.stringify({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _links : {
                        self: {
                            href : 'http://myserver.com/api/users/1'
                        }
                    }
                }));

            });

            it('With a complex object without links and with embedded resources', function() {

                // Configures backbone.hateoas to always serialze using HAL
                Hal.contentType = 'application/hal+json';

                var user = new Hal.Model({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _embedded : {
                        address : {
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
                        friends : [
                            {
                                firstName : 'Simon',
                                lastName : 'Baudry',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/2'
                                    }
                                }
                            },
                            {
                                firstName : 'John',
                                lastName : 'Doe',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/3'
                                    }
                                }
                            }
                        ],
                        hobbies : {
                            count : 3,
                            total : 12,
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=2'
                                },
                                first : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                prev : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                next : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=3'
                                },
                                last : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=4'
                                }
                            }
                        }
                    }
                });

                expect(JSON.stringify(user.toJSON())).to.equal(JSON.stringify({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _embedded : {
                        address : {
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
                        friends : [
                            {
                                firstName : 'Simon',
                                lastName : 'Baudry',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/2'
                                    }
                                }
                            },
                            {
                                firstName : 'John',
                                lastName : 'Doe',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/3'
                                    }
                                }
                            }
                        ],
                        hobbies : {
                            count : 3,
                            total : 12,
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=2'
                                },
                                first : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                prev : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                next : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=3'
                                },
                                last : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=4'
                                }
                            }
                        }
                    }
                }));

            });

            it('With a complex object with links and with embedded resources', function() {

                // Configures backbone.hateoas to always serialze using HAL
                Hal.contentType = 'application/hal+json';

                var user = new Hal.Model({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _embedded : {
                        address : {
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
                        friends : [
                            {
                                firstName : 'Simon',
                                lastName : 'Baudry',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/2'
                                    }
                                }
                            },
                            {
                                firstName : 'John',
                                lastName : 'Doe',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/3'
                                    }
                                }
                            }
                        ],
                        hobbies : {
                            count : 3,
                            total : 12,
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=2'
                                },
                                first : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                prev : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                next : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=3'
                                },
                                last : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=4'
                                }
                            }
                        }
                    },
                    _links : {
                        self: {
                            href : 'http://myserver.com/api/users/1'
                        }
                    }
                });

                expect(JSON.stringify(user.toJSON())).to.equal(JSON.stringify({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _embedded : {
                        address : {
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
                        friends : [
                            {
                                firstName : 'Simon',
                                lastName : 'Baudry',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/2'
                                    }
                                }
                            },
                            {
                                firstName : 'John',
                                lastName : 'Doe',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/3'
                                    }
                                }
                            }
                        ],
                        hobbies : {
                            count : 3,
                            total : 12,
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=2'
                                },
                                first : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                prev : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                next : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=3'
                                },
                                last : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=4'
                                }
                            }
                        }
                    },
                    _links : {
                        self: {
                            href : 'http://myserver.com/api/users/1'
                        }
                    }
                }));

            });

        });

        describe('toJSON using "application/json" content type', function() {

            it('With a simple object without links and without embedded resources', function() {

                // Configures backbone.hateoas to always serialze using plain JSON
                Hal.contentType = 'application/json';

                var user = new Hal.Model({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard'
                });

                expect(JSON.stringify(user.toJSON())).to.equal(JSON.stringify({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard'
                }));

            });

            it('With a simple object with links and without embedded resources', function() {

                // Configures backbone.hateoas to always serialze using plain JSON
                Hal.contentType = 'application/json';

                var user = new Hal.Model({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _links : {
                        self: {
                            href : 'http://myserver.com/api/users/1'
                        }
                    }
                });

                expect(JSON.stringify(user.toJSON())).to.equal(JSON.stringify({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard'
                }));

            });

            it('With a complex object without links and with embedded resources', function() {

                // Configures backbone.hateoas to always serialze using plain JSON
                Hal.contentType = 'application/json';

                var user = new Hal.Model({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _embedded : {
                        address : {
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
                        friends : [
                            {
                                firstName : 'Simon',
                                lastName : 'Baudry',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/2'
                                    }
                                }
                            },
                            {
                                firstName : 'John',
                                lastName : 'Doe',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/3'
                                    }
                                }
                            }
                        ],
                        hobbies : {
                            count : 3,
                            total : 12,
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=2'
                                },
                                first : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                prev : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                next : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=3'
                                },
                                last : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=4'
                                }
                            }
                        }
                    }
                });

                expect(JSON.stringify(user.toJSON())).to.equal(JSON.stringify({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    address : {
                        city : 'Paris',
                        country : 'France',
                        street : '142 Rue de Rivoli',
                        zip : '75001'
                    },
                    friends : [
                        {
                            firstName : 'Simon',
                            lastName : 'Baudry'
                        },
                        {
                            firstName : 'John',
                            lastName : 'Doe'
                        }
                    ],
                    hobbies : {
                        count : 3,
                        total : 12
                    }
                }));

            });

            it('With a complex object with links and with embedded resources', function() {

                // Configures backbone.hateoas to always serialze using plain JSON
                Hal.contentType = 'application/json';

                var user = new Hal.Model({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    _embedded : {
                        address : {
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
                        friends : [
                            {
                                firstName : 'Simon',
                                lastName : 'Baudry',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/2'
                                    }
                                }
                            },
                            {
                                firstName : 'John',
                                lastName : 'Doe',
                                _links : {
                                    self : {
                                        href: 'http://myserver.com/api/users/3'
                                    }
                                }
                            }
                        ],
                        hobbies : {
                            count : 3,
                            total : 12,
                            _links : {
                                self : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=2'
                                },
                                first : {
                                    href: 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                prev : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=1'
                                },
                                next : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=3'
                                },
                                last : {
                                    href : 'http://myserver.com/api/users/1/hobbies?page=4'
                                }
                            }
                        }
                    },
                    _links : {
                        self: {
                            href : 'http://myserver.com/api/users/1'
                        }
                    }
                });

                expect(JSON.stringify(user.toJSON())).to.equal(JSON.stringify({
                    firstName : 'Baptiste',
                    lastName : 'Gaillard',
                    address : {
                        city : 'Paris',
                        country : 'France',
                        street : '142 Rue de Rivoli',
                        zip : '75001'
                    },
                    friends : [
                        {
                            firstName : 'Simon',
                            lastName : 'Baudry'
                        },
                        {
                            firstName : 'John',
                            lastName : 'Doe'
                        }
                    ],
                    hobbies : {
                        count : 3,
                        total : 12
                    }
                }));

            });

        });

        describe('url', function() {

            it('With a valid self link should return the associated href', function() {

                // The special 'Hal.urlRoot' is like the Backbone.Model `urlRoot` property but is set globally on the
                // library
                Hal.urlRoot = 'https://shoulnotbeused_1.com';

                var users = new Hal.Collection();
                users.url = 'https://shoulnotbeused_2.com';

                var user = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard',
                        _links : {
                            self : {
                                href: 'http://myserver.com/api/users/1'
                            }
                        }
                    },
                    {
                        collection : users
                    }
                );
                user.set('id', 45658);
                user.urlRoot = 'https://shoulnotbeused_3.com';

                expect(user.url()).to.equal('http://myserver.com/api/users/1');

            });

            it('With no self link and with a `urlRoot`', function() {

                // The special 'Hal.urlRoot' is like the Backbone.Model `urlRoot` property but is set globally on the
                // library
                Hal.urlRoot = 'https://shoulnotbeused_1.com';

                var users = new Hal.Collection();
                users.url = 'https://shoulnotbeused_2.com';

                var user = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard'
                    },
                    {
                        collection : users
                    }
                );
                user.set('id', 1);
                user.urlRoot = 'http://myserver.com/api/users';

                expect(user.url()).to.equal('http://myserver.com/api/users/1');

            });

            it('With no self link no `urlRoot` and an attached collection', function() {

                // The special 'Hal.urlRoot' is like the Backbone.Model `urlRoot` property but is set globally on the
                // library
                Hal.urlRoot = 'https://shoulnotbeused_1.com';

                var users = new Hal.Collection();
                users.url = 'http://myserver.com/api/users';

                var user = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard'
                    },
                    {
                        collection : users
                    }
                );
                user.set('id', 1);

                expect(user.url()).to.equal('http://myserver.com/api/users/1');

            });

            it('With no self link no `urlRoot` no attached collection and a Hal.urlRoot', function() {

                // The special 'Hal.urlRoot' is like the Backbone.Model `urlRoot` property but is set globally on the
                // library
                Hal.urlRoot = 'http://myserver.com/api';

                var user = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard'
                    }
                );
                user.set('id', 1);

                expect(user.url()).to.equal('http://myserver.com/api/1');

            });

            it('With no self link no `urlRoot` no attached collection and a Hal.urlRoot and a urlMiddle', function() {

                // The special 'Hal.urlRoot' is like the Backbone.Model `urlRoot` property but is set globally on the
                // library
                Hal.urlRoot = 'http://myserver.com/api';

                var user = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard'
                    }
                );
                user.urlMiddle = 'users';
                user.set('id', 1);

                expect(user.url()).to.equal('http://myserver.com/api/users/1');

            });

            it('With no id should return base URL', function() {

                // The special 'Hal.urlRoot' is like the Backbone.Model `urlRoot` property but is set globally on the
                // library
                Hal.urlRoot = 'http://myserver.com/api';

                var user = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard'
                    }
                );
                user.urlMiddle = 'users';

                expect(user.url()).to.equal('http://myserver.com/api/users');

            });

            it('Failing to compute a base URL throw an exception', function() {

                Hal.urlRoot = null;

                var user = new Hal.Model(
                    {
                        firstName : 'Baptiste',
                        lastName : 'Gaillard'
                    }
                );

                expect(function() { user.url(); }).to.throw(Error, 'A "url" property or function must be specified');

            });

        });

    }
);
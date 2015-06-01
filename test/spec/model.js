/*jshint -W030 */

describe(
    'Hal.Model',
    function() {

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

        });
        
        describe('toJSON', function() {

            it('With a simple object without embedded properties', function() {
                
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
            
            it('With a complex object having embedded properties', function() {
                
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
            
        });
        
//        describe('initialize', function() {
//
//            it('url()', function(done) {
//            
//                var event = new Hal.Model();
//                event.set('id', 1);
//                event.urlRoot = 'https://www.verygoodmoment.com/rest/events';
//                
//                event.fetch().done(function() {
//                   
//                    console.log(event.toJSON());
//                    done();
//
//                });
//                
//            });
//            
//        });

    }
);
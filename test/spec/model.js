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
                expect(model.get('_links')).to.be.undefined;
                expect(model.getLinks()).to.be.undefined;

                // Check embedded properties
                expect(model.get('_embedded')).to.be.undefined;

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
                expect(model.get('_links')).to.be.undefined;
                expect(model.getLinks()).to.be.undefined;

                // Check embedded properties
                expect(model.get('_embedded')).to.be.undefined;
                
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
                expect(model.get('_links')).to.be.defined;
                expect(model.get('_links').attributes).to.have.property('friends');
                expect(model.get('_links').attributes).to.have.property('self');
                expect(model.get('_links').get('friends')).to.be.defined;
                expect(model.get('_links').get('self')).to.be.defined;
                
                var friends = model.get('_links').get('friends');
                expect(friends.isArray()).to.be.true;
                expect(friends.size()).to.equal(2);
                expect(friends.at(0).get('href')).to.equal('http://myserver.com/api/users/2');                
                expect(friends.at(0).getHref()).to.equal('http://myserver.com/api/users/2');
                expect(friends.at(1).get('href')).to.equal('http://myserver.com/api/users/3');
                expect(friends.at(1).getHref()).to.equal('http://myserver.com/api/users/3');

                var self = model.get('_links').get('self');
                expect(self.isArray()).to.be.false;
                expect(self.get('href')).to.equal('http://myserver.com/api/users/1');
                expect(self.getHref()).to.equal('http://myserver.com/api/users/1');

                // Check embedded properties
                expect(model.get('_embedded')).to.be.undefined;
                
            });

        });

    }
);
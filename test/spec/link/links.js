/*jshint -W030 */

describe(
    'Hal.Links', 
    function() {

        describe('initialize', function() {

            it('With empty attibutes', function() {

                var links = new Hal.Links();
                
                expect(links.attributes).to.be.defined;
                expect(links.attributes).to.be.empty;
                
                expect(links.getSelf()).to.be.undefined;
                expect(links.hasSelf()).to.be.false;
                
            });
            
            it('With self attribute only', function() {

                var links = new Hal.Links({
                    self : {
                        href: 'http://myserver.com/api/users/1'
                    }
                });
                
                expect(links.attributes).to.be.defined;
                expect(Object.keys(links.attributes)).to.have.length(1);
                expect(links.attributes).to.have.property('self');
                
                expect(links.getSelf()).to.be.defined;
                expect(links.getSelf()).to.be.instanceof(Hal.Link);
                expect(links.hasSelf()).to.be.true;
                
                var self = links.getSelf();
                expect(self.attributes).to.be.defined;
                expect(Object.keys(self.attributes)).to.have.length(2);
                expect(self.attributes).to.have.property('href');
                expect(self.attributes).to.have.property('templated');
                expect(self.get('href')).to.equal('http://myserver.com/api/users/1');
                expect(self.isTemplated()).to.be.false;
                
            });
            
            it('With multiple attributes', function() {

                var links = new Hal.Links({
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
                });
                
                expect(links.attributes).to.be.defined;
                expect(Object.keys(links.attributes)).to.have.length(2);
                expect(links.attributes).to.have.property('friends');
                expect(links.attributes).to.have.property('self');
                
                expect(links.getSelf()).to.be.defined;
                expect(links.getSelf()).to.be.instanceof(Hal.Link);
                expect(links.hasSelf()).to.be.true;
                
                var self = links.getSelf();
                expect(self.attributes).to.be.defined;
                expect(Object.keys(self.attributes)).to.have.length(2);
                expect(self.attributes).to.have.property('href');
                expect(self.attributes).to.have.property('templated');
                expect(self.get('href')).to.equal('http://myserver.com/api/users/1');
                expect(self.isTemplated()).to.be.false;
                
                var friends = links.get('friends');
                expect(friends).to.be.instanceof(Hal.LinkArray);
                expect(friends).to.have.length(2);
                expect(friends.toJSON()).to.deep.equal([
                    {
                        href: 'http://myserver.com/api/users/2'
                    },
                    {
                        href: 'http://myserver.com/api/users/3'
                    }
                ]);
                
            });
            
            it('With undefined and null attributes', function() {
                
                var links = new Hal.Links({
                    self : {
                        href: 'http://myserver.com/api/users/1'
                    },
                    undefinedEmbeddedRessource : undefined,
                    nullEmbeddedRessource : null
                });
                
                expect(links.attributes).to.be.defined;
                expect(Object.keys(links.attributes)).to.have.length(3);
                
                // Checks self attribute
                expect(links.attributes).to.have.property('self');
                expect(links.getSelf()).to.be.defined;
                expect(links.getSelf()).to.be.instanceof(Hal.Link);
                expect(links.hasSelf()).to.be.true;
                
                var self = links.getSelf();
                expect(self.attributes).to.be.defined;
                expect(Object.keys(self.attributes)).to.have.length(2);
                expect(self.attributes).to.have.property('href');
                expect(self.attributes).to.have.property('templated');
                expect(self.get('href')).to.equal('http://myserver.com/api/users/1');
                expect(self.isTemplated()).to.be.false;
                
                // Checks undefinedEmbeddedRessource attribute
                expect(links.attributes).to.have.property('undefinedEmbeddedRessource');
                expect(links.get('undefinedEmbeddedRessource')).to.be.undefined;
                
                // Checks nullEmbeddedRessource attribute
                expect(links.attributes).to.have.property('nullEmbeddedRessource');
                expect(links.get('nullEmbeddedRessource')).to.be.null;
                
            });
            
        });
        
        describe('toJSON', function() {

            it('With empty attributes', function() {
            
                var links = new Hal.Links();
                
                expect(links.toJSON()).to.deep.equal({});
                
            });
            
            it('With multiple attributes', function() {
                
                var links = new Hal.Links({
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
                });
                
                expect(links.toJSON()).to.deep.equal({
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
               });
                
            });
            
            it('With undefined and null attributes', function() {
                
                var links = new Hal.Links({
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
                    },
                    undefinedEmbeddedRessource : undefined,
                    nullEmbeddedRessource : null
                });
                
                expect(links.toJSON()).to.deep.equal({
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
                   },
                   undefinedEmbeddedRessource : undefined,
                   nullEmbeddedRessource : null
               });
                
            });
            
        });

        describe('unset', function() {

            /**
             * Unit test used to check that the behavior of the unset function of the Hal.Links object is identical 
             * to the similar function of the the Backbone.Model object.
             *  
             * @see https://github.com/gomoob/backbone.hateoas/issues/5
             */ 
            it('With simple use case', function() {
            
                var links = new Hal.Links({
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
                });
                
                // Checks the link created
                expect(links.attributes).to.be.defined;
                expect(Object.keys(links.attributes)).to.have.length(2);
                expect(links.attributes).to.have.property('friends');
                expect(links.attributes).to.have.property('self');
                
                expect(links.getSelf()).to.be.defined;
                expect(links.getSelf()).to.be.instanceof(Hal.Link);
                expect(links.hasSelf()).to.be.true;
                
                self = links.getSelf();
                expect(self.attributes).to.be.defined;
                expect(Object.keys(self.attributes)).to.have.length(2);
                expect(self.attributes).to.have.property('href');
                expect(self.attributes).to.have.property('templated');
                expect(self.get('href')).to.equal('http://myserver.com/api/users/1');
                expect(self.isTemplated()).to.be.false;
                
                friends = links.get('friends');
                expect(friends).to.be.instanceof(Hal.LinkArray);
                expect(friends).to.have.length(2);
                expect(friends.toJSON()).to.deep.equal([
                    {
                        href: 'http://myserver.com/api/users/2'
                    },
                    {
                        href: 'http://myserver.com/api/users/3'
                    }
                ]);
                
                // Tries to unset an attribute
                links.unset('friends');
                
                // Checks that the attribute has been unset and deleted
                expect(links.attributes).to.be.defined;
                expect(Object.keys(links.attributes)).to.have.length(1);
                expect(links.attributes).to.have.property('self');
                
                expect(links.getSelf()).to.be.defined;
                expect(links.getSelf()).to.be.instanceof(Hal.Link);
                expect(links.hasSelf()).to.be.true;
                
                var self = links.getSelf();
                expect(self.attributes).to.be.defined;
                expect(Object.keys(self.attributes)).to.have.length(2);
                expect(self.attributes).to.have.property('href');
                expect(self.attributes).to.have.property('templated');
                expect(self.get('href')).to.equal('http://myserver.com/api/users/1');
                expect(self.isTemplated()).to.be.false;
                
            });
            
        });
        
    }
);